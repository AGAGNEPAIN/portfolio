export interface MagneticStyle {
  transform: string;
  boxShadow: string;
  zIndex: string;
}

const REACH_PX = 260;

export const MAGNETIC_RESET: MagneticStyle = {
  transform: "translate(0,0) rotateY(0) rotateX(0) scale(1)",
  boxShadow: "none",
  zIndex: "",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Magnetic pointer-follow transform for a card: pulls/tilts/lifts it toward
 * the pointer within `REACH_PX`, strongest at the card's center. Returns
 * `null` (caller should use MAGNETIC_RESET) once the pointer is out of reach.
 */
export function computeMagneticStyle(
  cardRect: { left: number; top: number; width: number; height: number },
  pointerX: number,
  pointerY: number,
): MagneticStyle | null {
  const cx = cardRect.left + cardRect.width / 2;
  const cy = cardRect.top + cardRect.height / 2;
  const dx = pointerX - cx;
  const dy = pointerY - cy;
  const distance = Math.hypot(dx, dy);
  if (distance >= REACH_PX) return null;

  const f = (REACH_PX - distance) / REACH_PX;
  const nx = clamp(dx / (cardRect.width / 2), -1, 1);
  const ny = clamp(dy / (cardRect.height / 2), -1, 1);

  return {
    transform: `translate(${dx * 0.05 * f}px, ${dy * 0.05 * f}px) rotateY(${nx * 9 * f}deg) rotateX(${-ny * 9 * f}deg) scale(${1 + 0.12 * f}) translateZ(${40 * f}px)`,
    boxShadow: `0 ${18 * f}px ${54 * f}px rgba(0,0,0,${0.42 * f})`,
    zIndex: String(10 + Math.round(f * 10)),
  };
}
