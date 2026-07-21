export interface TiltAngles {
  rotateX: number;
  rotateY: number;
}

/**
 * Rotation for a pointer-tracking tilt effect, given the pointer position and
 * the bounding box of the tilted element. Center of the box = no tilt.
 */
export function computeTiltAngles(
  pointerX: number,
  pointerY: number,
  rect: { left: number; top: number; width: number; height: number },
  maxDeg: number,
): TiltAngles {
  if (rect.width === 0 || rect.height === 0) return { rotateX: 0, rotateY: 0 };
  const nx = (pointerX - rect.left) / rect.width - 0.5;
  const ny = (pointerY - rect.top) / rect.height - 0.5;
  return {
    // `+ 0` avoids returning -0 when the pointer sits exactly at the center.
    rotateY: nx * maxDeg + 0,
    rotateX: -ny * maxDeg + 0,
  };
}
