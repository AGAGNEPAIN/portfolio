import { describe, expect, it } from "vitest";
import { computeTiltAngles } from "./tilt";

const rect = { left: 0, top: 0, width: 100, height: 100 };

describe("computeTiltAngles", () => {
  it("is neutral when the pointer is at the center", () => {
    expect(computeTiltAngles(50, 50, rect, 14)).toEqual({ rotateX: 0, rotateY: 0 });
  });

  it("tilts right/up when the pointer is at the top-right corner", () => {
    const { rotateX, rotateY } = computeTiltAngles(100, 0, rect, 14);
    expect(rotateY).toBeCloseTo(7);
    expect(rotateX).toBeCloseTo(7);
  });

  it("tilts left/down when the pointer is at the bottom-left corner", () => {
    const { rotateX, rotateY } = computeTiltAngles(0, 100, rect, 14);
    expect(rotateY).toBeCloseTo(-7);
    expect(rotateX).toBeCloseTo(-7);
  });

  it("scales with maxDeg", () => {
    const a = computeTiltAngles(100, 50, rect, 10);
    const b = computeTiltAngles(100, 50, rect, 20);
    expect(b.rotateY).toBeCloseTo(a.rotateY * 2);
  });

  it("returns neutral for a zero-sized rect", () => {
    expect(computeTiltAngles(10, 10, { left: 0, top: 0, width: 0, height: 0 }, 14)).toEqual({
      rotateX: 0,
      rotateY: 0,
    });
  });
});
