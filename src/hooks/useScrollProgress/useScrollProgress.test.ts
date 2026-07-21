import { renderHook } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { describe, expect, it } from "vitest";
import { useScrollProgress } from "./useScrollProgress";

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

describe("useScrollProgress", () => {
  it("reads the initial scroll progress on mount", () => {
    setDocumentMetrics(500, 3000, 1000);
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0.25);
  });

  it("updates on scroll", () => {
    setDocumentMetrics(0, 3000, 1000);
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);

    setDocumentMetrics(2000, 3000, 1000);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(1);
  });

  it("recomputes on resize since scrollHeight can change", () => {
    setDocumentMetrics(500, 3000, 1000);
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0.25);

    setDocumentMetrics(500, 1500, 1000);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current).toBe(1);
  });
});
