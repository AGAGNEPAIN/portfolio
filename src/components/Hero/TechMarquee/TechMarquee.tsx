import { TECH_MARQUEE_ITEMS } from "../../../lib/constants/constants";
import styles from "./TechMarquee.module.css";

const SEPARATOR = " — ";

/** Decorative infinite horizontal ticker of tech items, purely a visual echo of the Stack section. */
export function TechMarquee() {
  const content = `${TECH_MARQUEE_ITEMS.join(SEPARATOR)}${SEPARATOR}`;

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        <span className={styles.copy}>{content}</span>
        <span className={styles.copy}>{content}</span>
      </div>
    </div>
  );
}
