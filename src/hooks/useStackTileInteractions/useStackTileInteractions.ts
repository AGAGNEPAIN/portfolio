import type { RefObject } from "preact";
import { useEffect } from "preact/hooks";
import { FINE_POINTER_QUERY } from "../../lib/constants/constants";
import { MAGNETIC_RESET, computeMagneticStyle } from "../../lib/magnetic/magnetic";

const FLIP_MS = 640;

/**
 * Imperative pointer-follow "magnetic" pull and click-to-flip for the
 * `[data-tile]` cards inside `gridRef`. Runs outside Preact's render cycle
 * (direct style mutation) since it needs to track every pointer move at
 * frame rate without re-rendering the whole grid. No-ops on touch/coarse
 * pointers, where a hover-following field doesn't make sense.
 */
export function useStackTileInteractions(gridRef: RefObject<HTMLElement>): void {
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (!window.matchMedia(FINE_POINTER_QUERY).matches) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-tile]"));
    const busy = new WeakSet<HTMLElement>();

    const applyReset = (card: HTMLElement) => {
      card.style.transform = MAGNETIC_RESET.transform;
      card.style.boxShadow = MAGNETIC_RESET.boxShadow;
      card.style.zIndex = MAGNETIC_RESET.zIndex;
    };

    const onMove = (e: PointerEvent) => {
      for (const card of cards) {
        if (busy.has(card)) continue;
        const style = computeMagneticStyle(card.getBoundingClientRect(), e.clientX, e.clientY);
        if (style) {
          card.style.transform = style.transform;
          card.style.boxShadow = style.boxShadow;
          card.style.zIndex = style.zIndex;
        } else {
          applyReset(card);
        }
      }
    };

    const onLeave = () => {
      for (const card of cards) if (!busy.has(card)) applyReset(card);
    };

    const onClick = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-tile]");
      if (!card || busy.has(card)) return;
      busy.add(card);
      card.style.transition = "transform 0.62s cubic-bezier(.34,1.56,.64,1), box-shadow 0.4s";
      card.style.transform = "perspective(700px) rotateY(360deg) scale(1.08)";
      card.style.boxShadow = "0 18px 44px rgba(0,0,0,0.32)";
      setTimeout(() => {
        card.style.transition = "transform 0.3s cubic-bezier(.16,1,.3,1), box-shadow 0.3s";
        applyReset(card);
        busy.delete(card);
      }, FLIP_MS);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    grid.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      grid.removeEventListener("click", onClick);
    };
  }, [gridRef]);
}
