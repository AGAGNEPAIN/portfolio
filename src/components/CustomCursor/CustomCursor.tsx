import { useEffect, useRef } from "preact/hooks";
import { FINE_POINTER_QUERY } from "../../lib/constants/constants";
import { lerp } from "../../lib/cursor/cursor";
import styles from "./CustomCursor.module.css";

const EASE = 0.22;

/**
 * Cream dot that trails the pointer with a lerped delay, growing into a ring
 * over links/buttons. Desktop (fine-pointer) only — a trailing cursor is
 * meaningless on touch.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    if (!window.matchMedia(FINE_POINTER_QUERY).matches) return;

    let targetX = -100;
    let targetY = -100;
    let x = -100;
    let y = -100;
    let raf: number;

    const loop = () => {
      x = lerp(x, targetX, EASE);
      y = lerp(y, targetY, EASE);
      dot.style.top = `${y}px`;
      dot.style.left = `${x}px`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const hot = (e.target as HTMLElement | null)?.closest?.("a,button");
      dot.classList.toggle(styles.hot, Boolean(hot));
    };

    document.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <div ref={dotRef} className={styles.dot} aria-hidden="true" />;
}
