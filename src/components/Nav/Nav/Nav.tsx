import { useRef } from "preact/hooks";
import { useNoiseBackground } from "../../../hooks/useNoiseBackground/useNoiseBackground";
import { useScrolled } from "../../../hooks/useScrolled/useScrolled";
import { useLanguage } from "../../../i18n/LanguageContext";
import { AvailabilityDot } from "../../common/AvailabilityDot/AvailabilityDot";
import { AgMark } from "../../icons/AgMark/AgMark";
import { LanguageSwitch } from "../LanguageSwitch/LanguageSwitch";
import styles from "./Nav.module.css";

interface NavProps {
  /** Flips to a light background / dark foreground, e.g. over a light section. */
  inverted?: boolean;
  /** Plays the logo's hand-drawn stroke-in once (e.g. right after the preloader hides). */
  animateLogo?: boolean;
}

/** Fixed site header: logo, language switch and a contact pill. */
export function Nav({ inverted = false, animateLogo = false }: NavProps) {
  const { lang } = useLanguage();
  const scrolled = useScrolled(80);
  const grainRef = useRef<HTMLDivElement>(null);
  useNoiseBackground(grainRef);

  const className = [styles.nav, scrolled ? styles.compact : "", inverted ? styles.inverted : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={className}>
      <div ref={grainRef} className={styles.grain} aria-hidden="true" />
      <a
        href="#top"
        className={styles.logo}
        aria-label={lang === "fr" ? "Retour en haut" : "Back to top"}
      >
        <AgMark animate={animateLogo} />

        <span className={styles.badge}>
          <AvailabilityDot size={6} />
        </span>
      </a>

      <div className={styles.right}>
        <LanguageSwitch />
        <a href="#contact" className={styles.contact}>
          CONTACT
        </a>
      </div>
    </nav>
  );
}
