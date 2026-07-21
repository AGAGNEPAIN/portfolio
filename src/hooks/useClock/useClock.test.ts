import { renderHook } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useClock } from "./useClock";

describe("useClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-21T10:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("formats the time as HH:MM:SS", () => {
    const { result } = renderHook(() => useClock("Europe/Paris"));
    expect(result.current).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it("ticks forward every second", () => {
    const { result } = renderHook(() => useClock("Europe/Paris"));
    const first = result.current;
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).not.toBe(first);
  });

  it("falls back gracefully for an invalid time zone", () => {
    const { result } = renderHook(() => useClock("Not/AZone"));
    expect(result.current).toBe("--:--:--");
  });
});
