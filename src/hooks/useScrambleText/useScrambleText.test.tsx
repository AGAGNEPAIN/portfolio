import { render } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { describe, expect, it, vi } from "vitest";
import { useScrambleText } from "./useScrambleText";

/** Replaces rAF with a manually-steppable queue so the scramble loop is deterministic. */
function stubAnimationFrame() {
  const callbacks: FrameRequestCallback[] = [];
  window.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
    callbacks.push(cb);
    return callbacks.length;
  }) as unknown as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = vi.fn();
  return {
    tick: (times = 1) => {
      for (let i = 0; i < times; i++) {
        const due = callbacks.splice(0, callbacks.length);
        for (const cb of due) cb(0);
      }
    },
  };
}

function Probe({ text, triggerKey }: { text: string; triggerKey: unknown }) {
  const displayed = useScrambleText(text, triggerKey);
  return <span data-testid="text">{displayed}</span>;
}

describe("useScrambleText", () => {
  it("shows the final text immediately on first render, without scrambling", () => {
    stubAnimationFrame();
    const { getByTestId } = render(<Probe text="Disponible" triggerKey="fr" />);
    expect(getByTestId("text").textContent).toBe("Disponible");
  });

  it("scrambles then settles back to the (possibly new) text once triggerKey changes", () => {
    const raf = stubAnimationFrame();
    const { getByTestId, rerender } = render(<Probe text="Disponible" triggerKey="fr" />);

    rerender(<Probe text="Available" triggerKey="en" />);
    // Mid-animation: some frames have run but not all — text is scrambled.
    act(() => raf.tick(2));
    expect(getByTestId("text").textContent).not.toBe("Available");
    expect(getByTestId("text").textContent).toHaveLength("Available".length);

    // Run out the rest of the animation.
    act(() => raf.tick(60));
    expect(getByTestId("text").textContent).toBe("Available");
  });

  it("does not restart the animation when only `text` changes without a new triggerKey", () => {
    const raf = stubAnimationFrame();
    const { getByTestId, rerender } = render(<Probe text="Disponible" triggerKey="fr" />);
    rerender(<Probe text="Something else" triggerKey="fr" />);
    act(() => raf.tick(5));
    expect(getByTestId("text").textContent).toBe("Disponible");
  });
});
