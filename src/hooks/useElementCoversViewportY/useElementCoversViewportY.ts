import type { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";
import { rectCoversY } from "../../lib/geometry/geometry";

/**
 * True while the element behind `ref` currently covers the horizontal line at
 * viewport y-coordinate `y` — e.g. "is this section behind the nav bar right now".
 */
export function useElementCoversViewportY<T extends Element>(
  ref: RefObject<T>,
  y: number,
): boolean {
  const [covers, setCovers] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = ref.current;
      setCovers(el ? rectCoversY(el.getBoundingClientRect(), y) : false);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [ref, y]);

  return covers;
}
