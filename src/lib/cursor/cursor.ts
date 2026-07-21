/** Exponential ease toward `target`, one frame's worth given `factor` (0–1). */
export function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}
