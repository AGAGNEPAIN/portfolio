import { useEffect, useState } from "preact/hooks";
import { useLanguage } from "../../i18n/LanguageContext";
import { AvailabilityDot } from "../common/AvailabilityDot/AvailabilityDot";
import { AgMark } from "../icons/AgMark/AgMark";
import styles from "./Preloader.module.css";

const MIN_VISIBLE_MS = 900;
const WIPE_START_MS = 180;
const REVEAL_LOGO_MS = 950;
const REMOVE_MS = 1200;

interface PreloaderProps {
  onRevealLogo: () => void;
  onDone: () => void;
}
export function Preloader({ onRevealLogo, onDone }: PreloaderProps) {
  const { t } = useLanguage();
  const [leaving, setLeaving] = useState(false);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const timers: number[] = [];

    const hide = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
      timers.push(
        window.setTimeout(() => {
          setLeaving(true);
          timers.push(window.setTimeout(() => setWiping(true), WIPE_START_MS));
          timers.push(window.setTimeout(onRevealLogo, REVEAL_LOGO_MS));
          timers.push(window.setTimeout(onDone, REMOVE_MS));
        }, wait),
      );
    };

    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });

    return () => {
      window.removeEventListener("load", hide);
      timers.forEach(clearTimeout);
    };
  }, [onRevealLogo, onDone]);

  return (
    <div className={[styles.overlay, wiping ? styles.wiping : ""].filter(Boolean).join(" ")}>
      <div className={[styles.inner, leaving ? styles.leaving : ""].filter(Boolean).join(" ")}>
        <span className={styles.markWrap}>
          <AgMark animate className={styles.mark} />
          <span className={styles.badge}>
            <AvailabilityDot size={11} />
          </span>
        </span>
        <span className={styles.progressTrack}>
          <span className={styles.progressFill} />
        </span>
        <output className={styles.label} aria-live="polite">
          {t.loadingLabel}
          <span className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
        </output>
      </div>
    </div>
  );
}
