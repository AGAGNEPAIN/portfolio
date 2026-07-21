import type { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";
import { FINE_POINTER_QUERY } from "../../lib/constants/constants";
import { type TiltAngles, computeTiltAngles } from "../../lib/tilt/tilt";

const NEUTRAL: TiltAngles = { rotateX: 0, rotateY: 0 };

/**
 * Subtle pointer-tracking tilt for the element behind `ref`. No-ops on
 * touch/coarse-pointer devices, where hover tracking doesn't make sense.
 */
export function usePointerTilt<T extends HTMLElement>(ref: RefObject<T>, maxDeg = 14): TiltAngles {
  const [angles, setAngles] = useState<TiltAngles>(NEUTRAL);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(FINE_POINTER_QUERY).matches) return;

    const onMove = (e: MouseEvent) => {
      setAngles(computeTiltAngles(e.clientX, e.clientY, el.getBoundingClientRect(), maxDeg));
    };
    const onLeave = () => setAngles(NEUTRAL);

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref, maxDeg]);

  return angles;
}
