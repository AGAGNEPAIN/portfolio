import type { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";
import { isHeaderStuck } from "../../lib/stickyHeader/stickyHeader";

/** Whether the sticky `headerRef` inside `sectionRef` is currently pinned. */
export function useStickyHeaderShrink(
  headerRef: RefObject<HTMLElement>,
  sectionRef: RefObject<HTMLElement>,
  stickLinePx = 44,
): boolean {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const check = () => {
      const header = headerRef.current;
      const section = sectionRef.current;
      if (!header || !section) {
        setStuck(false);
        return;
      }
      setStuck(
        isHeaderStuck(header.getBoundingClientRect(), section.getBoundingClientRect(), stickLinePx),
      );
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [headerRef, sectionRef, stickLinePx]);

  return stuck;
}
