import { describe, expect, it } from "vitest";
import { computeScrollProgress, isScrolledPast } from "./scroll";

describe("computeScrollProgress", () => {
  it("is 0 at the top of the page", () => {
    expect(computeScrollProgress(0, 3000, 1000)).toBe(0);
  });

  it("is 1 at the bottom of the page", () => {
    expect(computeScrollProgress(2000, 3000, 1000)).toBe(1);
  });

  it("is 0.5 halfway through the scrollable range", () => {
    expect(computeScrollProgress(1000, 3000, 1000)).toBe(0.5);
  });

  it("clamps values beyond the scrollable range", () => {
    expect(computeScrollProgress(9000, 3000, 1000)).toBe(1);
    expect(computeScrollProgress(-50, 3000, 1000)).toBe(0);
  });

  it("returns 0 when content does not overflow the viewport", () => {
    expect(computeScrollProgress(0, 500, 1000)).toBe(0);
  });
});

describe("isScrolledPast", () => {
  it("is false at or below the threshold", () => {
    expect(isScrolledPast(0, 80)).toBe(false);
    expect(isScrolledPast(80, 80)).toBe(false);
  });

  it("is true beyond the threshold", () => {
    expect(isScrolledPast(81, 80)).toBe(true);
  });
});
