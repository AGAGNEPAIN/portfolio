import { useClock } from "../../../hooks/useClock/useClock";
import styles from "./LocalClock.module.css";

/** Live Bordeaux (Europe/Paris) wall-clock time, used in the footer. */
export function LocalClock() {
  const time = useClock("Europe/Paris");
  return <span className={styles.time}>{time}</span>;
}
