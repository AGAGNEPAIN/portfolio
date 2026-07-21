import { describe, expect, it } from "vitest";
import { lerp } from "./cursor";

describe("lerp", () => {
  it("moves partway from current toward target", () => {
    expect(lerp(0, 100, 0.22)).toBeCloseTo(22);
  });

  it("returns current unchanged when factor is 0", () => {
    expect(lerp(50, 100, 0)).toBe(50);
  });

  it("returns target exactly when factor is 1", () => {
    expect(lerp(50, 100, 1)).toBe(100);
  });

  it("converges toward target over repeated steps", () => {
    let value = 0;
    for (let i = 0; i < 50; i++) value = lerp(value, 100, 0.22);
    expect(value).toBeGreaterThan(99.9);
  });
});
