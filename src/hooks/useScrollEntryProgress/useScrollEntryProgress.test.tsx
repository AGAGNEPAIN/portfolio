import { render } from "@testing-library/preact";
import { useRef } from "preact/hooks";
import { act } from "preact/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { useScrollEntryProgress } from "./useScrollEntryProgress";

function Probe() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollEntryProgress(ref, 0.4);
  return (
    <div ref={ref} data-testid="target">
      {progress.toFixed(2)}
    </div>
  );
}

describe("useScrollEntryProgress", () => {
  afterEach(() => {
    window.innerHeight = 768;
  });

  it("is 0 while the element's top hasn't reached the viewport bottom yet", () => {
    window.innerHeight = 900;
    const { getByTestId, getByText } = render(<Probe />);
    getByTestId("target").getBoundingClientRect = () => ({ top: 1000 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(getByText("0.00")).toBeInTheDocument();
  });

  it("reaches 1 once the top has travelled entryFraction of the viewport height past the bottom edge", () => {
    window.innerHeight = 900;
    const { getByTestId, getByText } = render(<Probe />);
    // raw = (900 - 540) / 900 = 0.4; progress = 0.4 / 0.4 = 1
    getByTestId("target").getBoundingClientRect = () => ({ top: 540 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(getByText("1.00")).toBeInTheDocument();
  });

  it("reports intermediate progress proportionally", () => {
    window.innerHeight = 900;
    const { getByTestId, getByText } = render(<Probe />);
    // raw = (900 - 810) / 900 = 0.1; progress = 0.1 / 0.4 = 0.25
    getByTestId("target").getBoundingClientRect = () => ({ top: 810 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(getByText("0.25")).toBeInTheDocument();
  });
});
