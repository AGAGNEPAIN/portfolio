import { render } from "@testing-library/preact";
import { useRef } from "preact/hooks";
import { act } from "preact/test-utils";
import { describe, expect, it } from "vitest";
import { useStickyHeaderShrink } from "./useStickyHeaderShrink";

function Probe() {
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stuck = useStickyHeaderShrink(headerRef, sectionRef);
  return (
    <div ref={sectionRef} data-testid="section">
      <div ref={headerRef} data-testid="header">
        {String(stuck)}
      </div>
    </div>
  );
}

describe("useStickyHeaderShrink", () => {
  it("reflects the stuck state and updates it on scroll", () => {
    const { getByText, getByTestId } = render(<Probe />);
    const header = getByTestId("header");
    const section = getByTestId("section");

    header.getBoundingClientRect = () => ({ top: 200, height: 60 }) as DOMRect;
    section.getBoundingClientRect = () => ({ bottom: 800 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(getByText("false")).toBeInTheDocument();

    header.getBoundingClientRect = () => ({ top: 44, height: 60 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(getByText("true")).toBeInTheDocument();
  });
});
