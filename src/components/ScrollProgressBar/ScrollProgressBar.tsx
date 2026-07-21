import { useScrollProgress } from "../../hooks/useScrollProgress/useScrollProgress";
import styles from "./ScrollProgressBar.module.css";

/** Fixed hairline across the top of the viewport that fills in as the page scrolls. */
export function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div className={styles.bar} style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
  );
}
