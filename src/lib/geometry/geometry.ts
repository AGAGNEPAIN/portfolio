/** Whether a rect currently covers the horizontal line at viewport y-coordinate `y`. */
export function rectCoversY(rect: { top: number; bottom: number }, y: number): boolean {
  return rect.top <= y && rect.bottom > y;
}
