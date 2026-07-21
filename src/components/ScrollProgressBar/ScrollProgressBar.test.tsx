import { render } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { describe, expect, it } from "vitest";
import { ScrollProgressBar } from "./ScrollProgressBar";

function setDocumentMetrics(scrollTop: number, scrollHeight: number, clientHeight: number) {
  Object.defineProperty(document.documentElement, "scrollTop", {
    value: scrollTop,
    configurable: true,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(document.documentElement, "clientHeight", {
    value: clientHeight,
    configurable: true,
  });
}

describe("ScrollProgressBar", () => {
  it("renders a single bar element", () => {
    setDocumentMetrics(0, 3000, 1000);
    const { container } = render(<ScrollProgressBar />);
    expect(container.querySelectorAll("div")).toHaveLength(1);
  });

  it("scales the bar's transform with live scroll progress", () => {
    setDocumentMetrics(0, 3000, 1000);
    const { container } = render(<ScrollProgressBar />);
    const bar = container.querySelector("div") as HTMLDivElement;
    expect(bar.style.transform).toBe("scaleX(0)");

    setDocumentMetrics(1000, 3000, 1000);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(bar.style.transform).toBe("scaleX(0.5)");
  });
});
