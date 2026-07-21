// While genuinely pinned, a sticky header's `top` sits essentially constant
// at its CSS sticky offset (aside from subpixel rounding) — it doesn't drift.
// Anything meaningfully below that means it has already released and is
// scrolling away with the rest of its section's normal flow.
const STUCK_TOLERANCE_PX = 2;

/**
 * Whether a sticky section header currently sits pinned at its stuck
 * position (rather than still scrolling in from below, or already released
 * and scrolling past together with the rest of its section).
 */
export function isHeaderStuck(
  headerRect: { top: number; height: number },
  sectionRect: { bottom: number },
  stickLinePx = 44,
): boolean {
  const pinned = headerRect.top <= stickLinePx && headerRect.top > stickLinePx - STUCK_TOLERANCE_PX;
  return pinned && sectionRect.bottom > headerRect.height + stickLinePx;
}
