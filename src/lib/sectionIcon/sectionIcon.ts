export type SectionIconKey = "exp" | "stack";

/** 4 line segments (x1,y1,x2,y2) per icon, on a 0–100 viewBox. */
export const ICON_GEOMETRY: Record<SectionIconKey, [number, number, number, number][]> = {
  exp: [
    [22, 80, 22, 60],
    [41, 80, 41, 46],
    [60, 80, 60, 32],
    [79, 80, 79, 18],
  ],
  stack: [
    [36, 28, 20, 50],
    [20, 50, 36, 72],
    [64, 28, 80, 50],
    [80, 50, 64, 72],
  ],
};
