import { render } from "@testing-library/preact";
import { useRef } from "preact/hooks";
import { act } from "preact/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useStackTileInteractions } from "./useStackTileInteractions";

function mockHoverFine(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia;
}

function Probe() {
  const gridRef = useRef<HTMLDivElement>(null);
  useStackTileInteractions(gridRef);
  return (
    <div ref={gridRef}>
      <div data-tile data-testid="card-a" />
      <div data-tile data-testid="card-b" />
    </div>
  );
}

describe("useStackTileInteractions", () => {
  const originalMatchMedia = window.matchMedia;
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
  });

  it("does nothing on coarse/touch pointers", () => {
    mockHoverFine(false);
    const { getByTestId } = render(<Probe />);
    const card = getByTestId("card-a");
    card.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new MouseEvent("pointermove", { clientX: 50, clientY: 50 }));
    });
    expect(card.style.transform).toBe("");
  });

  it("applies a magnetic transform to cards within reach and resets those out of reach", () => {
    mockHoverFine(true);
    const { getByTestId } = render(<Probe />);
    const cardA = getByTestId("card-a");
    const cardB = getByTestId("card-b");
    cardA.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
    cardB.getBoundingClientRect = () =>
      ({ left: 5000, top: 5000, width: 100, height: 100 }) as DOMRect;

    act(() => {
      window.dispatchEvent(new MouseEvent("pointermove", { clientX: 50, clientY: 50 }));
    });

    expect(cardA.style.transform).toContain("translate(0px, 0px)");
    expect(cardB.style.transform).toBe("translate(0,0) rotateY(0) rotateX(0) scale(1)");
  });

  it("resets all cards on pointerleave", () => {
    mockHoverFine(true);
    const { getByTestId } = render(<Probe />);
    const cardA = getByTestId("card-a");
    cardA.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new MouseEvent("pointermove", { clientX: 50, clientY: 50 }));
    });
    act(() => {
      window.dispatchEvent(new MouseEvent("pointerleave"));
    });
    expect(cardA.style.transform).toBe("translate(0,0) rotateY(0) rotateX(0) scale(1)");
  });

  it("flips a clicked card and resets it back after the animation completes", () => {
    vi.useFakeTimers();
    mockHoverFine(true);
    const { getByTestId } = render(<Probe />);
    const cardA = getByTestId("card-a");

    act(() => {
      cardA.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(cardA.style.transform).toContain("rotateY(360deg)");

    act(() => {
      vi.advanceTimersByTime(640);
    });
    expect(cardA.style.transform).toBe("translate(0,0) rotateY(0) rotateX(0) scale(1)");
  });
});
