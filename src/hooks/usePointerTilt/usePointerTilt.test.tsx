import { render } from "@testing-library/preact";
import { useRef } from "preact/hooks";
import { act } from "preact/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePointerTilt } from "./usePointerTilt";

function mockHoverFine(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia;
}

function Probe() {
  const ref = useRef<HTMLDivElement>(null);
  const { rotateX, rotateY } = usePointerTilt(ref, 14);
  return (
    <div ref={ref} data-testid="box" style={{ width: 100, height: 100 }}>
      {rotateX.toFixed(1)},{rotateY.toFixed(1)}
    </div>
  );
}

describe("usePointerTilt", () => {
  const originalMatchMedia = window.matchMedia;
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("stays neutral on coarse/touch devices", () => {
    mockHoverFine(false);
    const { getByTestId } = render(<Probe />);
    const box = getByTestId("box");
    box.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
    act(() => {
      box.dispatchEvent(new MouseEvent("mousemove", { clientX: 100, clientY: 0 }));
    });
    expect(box.textContent).toBe("0.0,0.0");
  });

  it("tilts on mousemove and resets on mouseleave for fine pointers", () => {
    mockHoverFine(true);
    const { getByTestId } = render(<Probe />);
    const box = getByTestId("box");
    box.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;

    act(() => {
      box.dispatchEvent(new MouseEvent("mousemove", { clientX: 100, clientY: 0 }));
    });
    expect(box.textContent).toBe("7.0,7.0");

    act(() => {
      box.dispatchEvent(new MouseEvent("mouseleave"));
    });
    expect(box.textContent).toBe("0.0,0.0");
  });
});
