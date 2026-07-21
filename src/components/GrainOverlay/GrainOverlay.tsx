import { useRef } from "preact/hooks";
import { useNoiseBackground } from "../../hooks/useNoiseBackground/useNoiseBackground";
import styles from "./GrainOverlay.module.css";

/** Fixed, fullscreen static-noise texture layered subtly over the page. */
export function GrainOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  useNoiseBackground(ref);

  return <div ref={ref} className={styles.overlay} aria-hidden="true" />;
}
