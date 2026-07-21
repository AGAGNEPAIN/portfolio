export const SCRAMBLE_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const NBSP = "\u00a0";

/** Frames the scramble-reveal runs for, capped so long strings don't drag on. */
export function computeScrambleDuration(length: number): number {
  return Math.min(52, 22 + length * 0.6);
}

/**
 * One animation frame of the scramble-reveal: characters before `revealCount`
 * (and any whitespace) show their final value; the rest cycle through `pool`
 * deterministically from `frame`, so re-rendering the same frame is stable.
 */
export function renderScrambledFrame(
  finalText: string,
  revealCount: number,
  frame: number,
  pool: string = SCRAMBLE_POOL,
): string {
  let out = "";
  for (let k = 0; k < finalText.length; k++) {
    const c = finalText[k];
    if (k < revealCount || c === " " || c === NBSP) {
      out += c;
    } else {
      out += pool[(frame * 2 + k * 3) % pool.length];
    }
  }
  return out;
}
