import { describe, expect, it } from "vitest";
import { generateNoisePixels } from "./noise";

describe("generateNoisePixels", () => {
  it("produces 4 bytes (RGBA) per pixel", () => {
    const pixels = generateNoisePixels(4);
    expect(pixels).toHaveLength(4 * 4 * 4);
  });

  it("is fully opaque", () => {
    const pixels = generateNoisePixels(3);
    for (let i = 3; i < pixels.length; i += 4) {
      expect(pixels[i]).toBe(255);
    }
  });

  it("is grayscale: R, G and B channels match", () => {
    const pixels = generateNoisePixels(5);
    for (let i = 0; i < pixels.length; i += 4) {
      expect(pixels[i]).toBe(pixels[i + 1]);
      expect(pixels[i]).toBe(pixels[i + 2]);
    }
  });

  it("is deterministic given a seeded random source", () => {
    const seeded = () => 0.5;
    const a = generateNoisePixels(2, seeded);
    const b = generateNoisePixels(2, seeded);
    expect(Array.from(a)).toEqual(Array.from(b));
  });
});
