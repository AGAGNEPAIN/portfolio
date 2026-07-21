import type { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";

/**
 * 0→1 progress for how far `ref`'s element has scrolled up from the bottom
 * of the viewport, reaching 1 once its top has travelled `entryFraction` of
 * the viewport height past the bottom edge. Mirrors CSS view-timeline's
 * "entry" phase restricted to an early range (e.g. `entry 0% entry 42%`),
 * driven by a scroll listener instead so it works without
 * `animation-timeline: view()` support.
 */
export function useScrollEntryProgress(ref: RefObject<HTMLElement>, entryFraction = 0.42): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const check = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const raw = (window.innerHeight - rect.top) / window.innerHeight;
      setProgress(Math.min(1, Math.max(0, raw / entryFraction)));
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [ref, entryFraction]);

  return progress;
}
