import { useEffect, useState } from "preact/hooks";
import { isScrolledPast } from "../../lib/scroll/scroll";

/** True once the page has been scrolled past `thresholdPx`. */
export function useScrolled(thresholdPx: number): boolean {
  const [scrolled, setScrolled] = useState(() => isScrolledPast(window.scrollY, thresholdPx));

  useEffect(() => {
    const onScroll = () => setScrolled(isScrolledPast(window.scrollY, thresholdPx));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [thresholdPx]);

  return scrolled;
}
