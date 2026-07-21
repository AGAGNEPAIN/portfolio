import { renderHook } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { describe, expect, it } from "vitest";
import { useScrolled } from "./useScrolled";

function setScrollY(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
}

describe("useScrolled", () => {
  it("is false before the threshold", () => {
    setScrollY(0);
    const { result } = renderHook(() => useScrolled(80));
    expect(result.current).toBe(false);
  });

  it("becomes true after scrolling past the threshold", () => {
    setScrollY(0);
    const { result } = renderHook(() => useScrolled(80));
    setScrollY(120);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);
  });
});
