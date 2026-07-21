export type RGB = readonly [number, number, number];

/** Relative luminance (0–1) of an sRGB triplet, ITU-R BT.601. */
export function luminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Maps a pixel to a two-color gradient based on its luminance. */
export function duotoneMap(r: number, g: number, b: number, dark: RGB, light: RGB): RGB {
  const l = luminance(r, g, b);
  return [
    dark[0] + (light[0] - dark[0]) * l,
    dark[1] + (light[1] - dark[1]) * l,
    dark[2] + (light[2] - dark[2]) * l,
  ];
}

/** Applies duotoneMap in place over an RGBA buffer (alpha untouched). */
export function applyDuotone(pixels: Uint8ClampedArray, dark: RGB, light: RGB): void {
  for (let i = 0; i < pixels.length; i += 4) {
    const [r, g, b] = duotoneMap(pixels[i], pixels[i + 1], pixels[i + 2], dark, light);
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
  }
}

/**
 * Height (in rows) of the drawn image that actually has pixel data, given an
 * RGBA buffer of `width`x`height`. Source images decoded from a truncated
 * file leave the remaining rows fully transparent (alpha 0) — this finds
 * where real content ends, so the caller can crop to it instead of showing a
 * hard cutoff into blank canvas.
 */
export function findDrawnHeight(pixels: Uint8ClampedArray, width: number, height: number): number {
  const sampleX = Math.floor(width / 2);
  for (let y = height - 1; y >= 0; y--) {
    const alpha = pixels[(y * width + sampleX) * 4 + 3];
    if (alpha !== 0) return y + 1;
  }
  return 0;
}
