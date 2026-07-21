import { render } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CustomCursor } from "./CustomCursor";
import styles from "./CustomCursor.module.css";

function mockHoverFine(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia;
}

/** Replaces rAF with a manually-steppable queue so the trail loop is deterministic. */
function stubAnimationFrame() {
  const callbacks: FrameRequestCallback[] = [];
  window.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
    callbacks.push(cb);
    return callbacks.length;
  }) as unknown as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = vi.fn();
  return {
    tick: () => {
      const due = callbacks.splice(0, callbacks.length);
      for (const cb of due) cb(0);
    },
  };
}

describe("CustomCursor", () => {
  const originalMatchMedia = window.matchMedia;
  const originalRaf = window.requestAnimationFrame;
  const originalCaf = window.cancelAnimationFrame;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.requestAnimationFrame = originalRaf;
    window.cancelAnimationFrame = originalCaf;
  });

  it("does not track the pointer on coarse/touch devices", () => {
    mockHoverFine(false);
    const raf = stubAnimationFrame();
    const { container } = render(<CustomCursor />);
    const dot = container.firstElementChild as HTMLElement;

    act(() => {
      document.dispatchEvent(new MouseEvent("mousemove", { clientX: 200, clientY: 150 }));
    });
    raf.tick();
    expect(dot.style.top).toBe("");
    expect(dot.style.left).toBe("");
  });

  it("eases toward the pointer position on fine-pointer devices", () => {
    mockHoverFine(true);
    const raf = stubAnimationFrame();
    const { container } = render(<CustomCursor />);
    const dot = container.firstElementChild as HTMLElement;

    act(() => {
      document.dispatchEvent(new MouseEvent("mousemove", { clientX: 200, clientY: 100 }));
    });
    raf.tick();

    // Starts off-screen at (-100,-100); one eased step should move it toward,
    // but not all the way to, the pointer target.
    expect(Number.parseFloat(dot.style.left)).toBeGreaterThan(-100);
    expect(Number.parseFloat(dot.style.left)).toBeLessThan(200);
  });

  it("grows into a ring while hovering a link or button", () => {
    mockHoverFine(true);
    stubAnimationFrame();
    const { container } = render(
      <div>
        <CustomCursor />
        <a href="#top">link</a>
        <div data-testid="plain">plain</div>
      </div>,
    );
    const dot = container.querySelector(`.${styles.dot}`) as HTMLElement;
    const link = container.querySelector("a") as HTMLElement;
    const plain = container.querySelector('[data-testid="plain"]') as HTMLElement;

    act(() => {
      link.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: 1, clientY: 1 }));
    });
    expect(dot.classList.contains(styles.hot)).toBe(true);

    act(() => {
      plain.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: 2, clientY: 2 }));
    });
    expect(dot.classList.contains(styles.hot)).toBe(false);
  });
});
