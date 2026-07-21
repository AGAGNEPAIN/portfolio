import styles from "./AvailabilityDot.module.css";

interface AvailabilityDotProps {
  size?: number;
  color?: string;
}

/** Small dot with an outward pulse ring, used to signal "available now". */
export function AvailabilityDot({ size = 10, color = "#9bb515" }: AvailabilityDotProps) {
  const style = { width: size, height: size, background: color };

  return (
    <span className={styles.wrap} style={{ width: size, height: size }}>
      <span className={styles.pulse} style={style} />
      <span className={styles.core} style={style} />
    </span>
  );
}
