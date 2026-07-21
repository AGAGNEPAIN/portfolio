import { describe, expect, it } from "vitest";
import { applyDuotone, duotoneMap, findDrawnHeight, luminance } from "./duotone";

describe("luminance", () => {
  it("is 0 for black", () => {
    expect(luminance(0, 0, 0)).toBe(0);
  });

  it("is 1 for white", () => {
    expect(luminance(255, 255, 255)).toBeCloseTo(1);
  });
});

describe("duotoneMap", () => {
  const dark: [number, number, number] = [11, 59, 44];
  const light: [number, number, number] = [239, 234, 216];

  it("maps black to the dark color", () => {
    expect(duotoneMap(0, 0, 0, dark, light)).toEqual(dark);
  });

  it("maps white to the light color", () => {
    const [r, g, b] = duotoneMap(255, 255, 255, dark, light);
    expect(r).toBeCloseTo(light[0]);
    expect(g).toBeCloseTo(light[1]);
    expect(b).toBeCloseTo(light[2]);
  });

  it("maps mid-gray roughly halfway between the two colors", () => {
    const [r] = duotoneMap(128, 128, 128, dark, light);
    expect(r).toBeGreaterThan(dark[0]);
    expect(r).toBeLessThan(light[0]);
  });
});

describe("applyDuotone", () => {
  it("rewrites RGB channels in place and leaves alpha untouched", () => {
    const pixels = new Uint8ClampedArray([0, 0, 0, 200, 255, 255, 255, 100]);
    applyDuotone(pixels, [11, 59, 44], [239, 234, 216]);
    expect([pixels[0], pixels[1], pixels[2]]).toEqual([11, 59, 44]);
    expect(pixels[3]).toBe(200);
    expect(pixels[7]).toBe(100);
  });
});

describe("findDrawnHeight", () => {
  function makeBuffer(width: number, height: number, opaqueRows: number): Uint8ClampedArray {
    const pixels = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < opaqueRows; y++) {
      for (let x = 0; x < width; x++) {
        pixels[(y * width + x) * 4 + 3] = 255;
      }
    }
    return pixels;
  }

  it("returns the full height when every row has content", () => {
    const pixels = makeBuffer(4, 4, 4);
    expect(findDrawnHeight(pixels, 4, 4)).toBe(4);
  });

  it("returns 0 when nothing was drawn (fully transparent)", () => {
    const pixels = makeBuffer(4, 4, 0);
    expect(findDrawnHeight(pixels, 4, 4)).toBe(0);
  });

  it("finds the boundary between drawn rows and a truncated (blank) tail", () => {
    const pixels = makeBuffer(4, 10, 6);
    expect(findDrawnHeight(pixels, 4, 10)).toBe(6);
  });
});
