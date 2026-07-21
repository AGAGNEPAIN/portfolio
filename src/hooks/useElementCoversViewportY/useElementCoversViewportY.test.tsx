import { render } from "@testing-library/preact";
import { useRef } from "preact/hooks";
import { act } from "preact/test-utils";
import { describe, expect, it } from "vitest";
import { useElementCoversViewportY } from "./useElementCoversViewportY";

function Probe({ y }: { y: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const covers = useElementCoversViewportY(ref, y);
  return <div ref={ref}>{String(covers)}</div>;
}

describe("useElementCoversViewportY", () => {
  it("reflects whether the element's rect covers the given y on mount", () => {
    const { getByText } = render(<Probe y={60} />);
    const el = getByText("false").closest("div") as HTMLElement;
    el.getBoundingClientRect = () => ({ top: 0, bottom: 100 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(getByText("true")).toBeInTheDocument();
  });

  it("updates on scroll as the rect moves past y", () => {
    const { getByText, container } = render(<Probe y={60} />);
    const el = container.firstElementChild as HTMLElement;
    el.getBoundingClientRect = () => ({ top: 0, bottom: 100 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(getByText("true")).toBeInTheDocument();

    el.getBoundingClientRect = () => ({ top: 200, bottom: 300 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(getByText("false")).toBeInTheDocument();
  });
});
