/** Opaque RGBA grayscale static, used as a subtle grain texture overlay. */
export function generateNoisePixels(
  size: number,
  random: () => number = Math.random,
): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    const v = Math.floor(random() * 255);
    pixels[i] = v;
    pixels[i + 1] = v;
    pixels[i + 2] = v;
    pixels[i + 3] = 255;
  }
  return pixels;
}
