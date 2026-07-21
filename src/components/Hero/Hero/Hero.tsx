import { useRef } from "preact/hooks";
import { useIsMobile } from "../../../hooks/useIsMobile/useIsMobile";
import { usePointerTilt } from "../../../hooks/usePointerTilt/usePointerTilt";
import { useLanguage } from "../../../i18n/LanguageContext";
import { COORDINATES } from "../../../lib/constants/constants";
import { AvailabilityDot } from "../../common/AvailabilityDot/AvailabilityDot";
import { ScrambleText } from "../../common/ScrambleText/ScrambleText";
import { AnimatedHeading } from "../AnimatedHeading/AnimatedHeading";
import { PortraitCard } from "../PortraitCard/PortraitCard";
import { TechMarquee } from "../TechMarquee/TechMarquee";
import styles from "./Hero.module.css";

/** Above-the-fold header: meta row, role/pitch/stats + portrait, giant name, tech ticker. */
export function Hero() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLElement>(null);
  const { rotateX, rotateY } = usePointerTilt(heroRef, 14);

  return (
    <header id="top" ref={heroRef} className={styles.hero}>
      <div className={styles.metaRow}>
        <span className={styles.metaItem}>
          <ScrambleText text={t.heroTag} />
        </span>
        {!isMobile && <span className={styles.metaItem}>{COORDINATES}</span>}
        <span className={styles.metaItem}>
          <AvailabilityDot />
          <ScrambleText text={t.heroAvail} />
        </span>
      </div>

      <div className={`${styles.midRow} ${isMobile ? styles.midRowMobile : ""}`}>
        <div className={styles.leftBlock}>
          <p className={styles.role}>
            <ScrambleText text={t.heroRole} />
            <span className={styles.cursor} aria-hidden="true">
              ▌
            </span>
          </p>

          {!isMobile && (
            <p className={styles.pitch}>
              <ScrambleText text={t.heroPitch} />
            </p>
          )}

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>TypeScript & PHP</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>
                <ScrambleText text={t.heroSince} />
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>
                <ScrambleText text={t.heroLangs} />
              </span>
            </div>
          </div>
        </div>

        <PortraitCard />
      </div>

      <div
        className={styles.nameTilt}
        style={{ transform: `perspective(1100px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)` }}
      >
        <AnimatedHeading text="Antoine Gagnepain." />
      </div>

      <div className={styles.marqueeSlot}>
        <TechMarquee />
      </div>
    </header>
  );
}
