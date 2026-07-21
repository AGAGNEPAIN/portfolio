import type { RefObject } from "preact";
import { useEffect } from "preact/hooks";
import { generateNoisePixels } from "../../lib/noise/noise";

const GRAIN_SIZE = 180;

/** Paints a subtle static-noise texture into `ref`'s element as a background-image, once. */
export function useNoiseBackground(ref: RefObject<HTMLElement>): void {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = GRAIN_SIZE;
    canvas.height = GRAIN_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx || !ref.current) return;

    const imageData = ctx.createImageData(GRAIN_SIZE, GRAIN_SIZE);
    imageData.data.set(generateNoisePixels(GRAIN_SIZE));
    ctx.putImageData(imageData, 0, 0);

    ref.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
  }, [ref]);
}
