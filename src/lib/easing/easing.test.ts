import { describe, expect, it } from "vitest";
import { cubicBezier, easeOutQuint } from "./easing";

describe("cubicBezier", () => {
  it("returns the identity function for a linear control-point pair", () => {
    const linear = cubicBezier(0.5, 0.5, 0.5, 0.5);
    expect(linear(0)).toBeCloseTo(0);
    expect(linear(0.37)).toBeCloseTo(0.37);
    expect(linear(1)).toBeCloseTo(1);
  });

  it("clamps input outside [0,1]", () => {
    const eased = cubicBezier(0.16, 1, 0.3, 1);
    expect(eased(-0.5)).toBe(0);
    expect(eased(1.5)).toBe(1);
  });

  it("passes through the fixed endpoints (0,0) and (1,1)", () => {
    const eased = cubicBezier(0.42, 0, 0.58, 1);
    expect(eased(0)).toBeCloseTo(0);
    expect(eased(1)).toBeCloseTo(1);
  });
});

describe("easeOutQuint", () => {
  it("matches --ease-out-quint (cubic-bezier(0.16, 1, 0.3, 1)): fast start, front-loaded", () => {
    // Values cross-checked against the standard cubic-bezier solving algorithm.
    expect(easeOutQuint(0)).toBeCloseTo(0, 4);
    expect(easeOutQuint(0.1)).toBeCloseTo(0.494, 2);
    expect(easeOutQuint(0.25)).toBeCloseTo(0.826, 2);
    expect(easeOutQuint(0.5)).toBeCloseTo(0.972, 2);
    expect(easeOutQuint(1)).toBeCloseTo(1, 4);
  });

  it("is monotonically non-decreasing", () => {
    let prev = Number.NEGATIVE_INFINITY;
    for (let x = 0; x <= 1; x += 0.05) {
      const y = easeOutQuint(x);
      expect(y).toBeGreaterThanOrEqual(prev);
      prev = y;
    }
  });
});
