/** Fraction (0–1) of the page that has been scrolled through. */
export function computeScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): number {
  const scrollable = scrollHeight - clientHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, scrollTop / scrollable));
}

export function isScrolledPast(scrollY: number, threshold: number): boolean {
  return scrollY > threshold;
}
