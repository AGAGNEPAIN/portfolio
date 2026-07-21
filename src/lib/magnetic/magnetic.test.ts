import { describe, expect, it } from "vitest";
import { MAGNETIC_RESET, computeMagneticStyle } from "./magnetic";

const rect = { left: 0, top: 0, width: 100, height: 100 };

describe("computeMagneticStyle", () => {
  it("is strongest (max pull, max shadow) when the pointer is at the card's center", () => {
    const style = computeMagneticStyle(rect, 50, 50);
    expect(style).not.toBeNull();
    expect(style?.transform).toContain("translate(0px, 0px)");
    expect(style?.zIndex).toBe("20");
  });

  it("pulls toward the pointer off-center, within reach", () => {
    const style = computeMagneticStyle(rect, 150, 50);
    expect(style).not.toBeNull();
    expect(style?.transform).toMatch(/translate\(\d/);
  });

  it("returns null once the pointer is beyond the reach radius", () => {
    expect(computeMagneticStyle(rect, 1000, 1000)).toBeNull();
  });

  it("clamps rotation contribution for pointers far outside the card bounds but still in reach", () => {
    const style = computeMagneticStyle(rect, 260, 50);
    expect(style).not.toBeNull();
    // nx clamps to 1, so rotateY should not exceed 9deg in magnitude (scaled by f).
    const match = style?.transform.match(/rotateY\((-?[\d.]+)deg\)/);
    expect(match).not.toBeNull();
    expect(Math.abs(Number(match?.[1]))).toBeLessThanOrEqual(9);
  });
});

describe("MAGNETIC_RESET", () => {
  it("resets transform, shadow and z-index to neutral values", () => {
    expect(MAGNETIC_RESET.transform).toBe("translate(0,0) rotateY(0) rotateX(0) scale(1)");
    expect(MAGNETIC_RESET.boxShadow).toBe("none");
    expect(MAGNETIC_RESET.zIndex).toBe("");
  });
});
