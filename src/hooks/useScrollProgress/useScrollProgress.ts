import { useEffect, useState } from "preact/hooks";
import { computeScrollProgress } from "../../lib/scroll/scroll";

function readProgress(): number {
  const el = document.documentElement;
  return computeScrollProgress(el.scrollTop, el.scrollHeight, el.clientHeight);
}

/** Fraction (0–1) of the page scrolled through, updated live on scroll/resize. */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(readProgress);

  useEffect(() => {
    const onUpdate = () => setProgress(readProgress());
    onUpdate();
    window.addEventListener("scroll", onUpdate, { passive: true });
    window.addEventListener("resize", onUpdate);
    return () => {
      window.removeEventListener("scroll", onUpdate);
      window.removeEventListener("resize", onUpdate);
    };
  }, []);

  return progress;
}
