import { describe, expect, it } from "vitest";
import { rectCoversY } from "./geometry";

describe("rectCoversY", () => {
  it("is true when y sits strictly inside the rect", () => {
    expect(rectCoversY({ top: 0, bottom: 100 }, 50)).toBe(true);
  });

  it("is true at the top edge (inclusive)", () => {
    expect(rectCoversY({ top: 60, bottom: 100 }, 60)).toBe(true);
  });

  it("is false at the bottom edge (exclusive)", () => {
    expect(rectCoversY({ top: 0, bottom: 60 }, 60)).toBe(false);
  });

  it("is false when y is above the rect", () => {
    expect(rectCoversY({ top: 60, bottom: 100 }, 10)).toBe(false);
  });

  it("is false when y is below the rect", () => {
    expect(rectCoversY({ top: 0, bottom: 60 }, 200)).toBe(false);
  });

  it("is false for a degenerate zero-height rect", () => {
    expect(rectCoversY({ top: 60, bottom: 60 }, 60)).toBe(false);
  });
});
