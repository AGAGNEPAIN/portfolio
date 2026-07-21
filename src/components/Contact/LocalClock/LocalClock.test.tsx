import { render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocalClock } from "./LocalClock";

describe("LocalClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-21T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the current time as HH:MM:SS", () => {
    render(<LocalClock />);
    expect(screen.getByText(/^\d{2}:\d{2}:\d{2}$/)).toBeInTheDocument();
  });
});
