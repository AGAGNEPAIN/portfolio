import type { Ref } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useMergedRef } from "../../../hooks/useMergedRef/useMergedRef";
import { useStickyHeaderShrink } from "../../../hooks/useStickyHeaderShrink/useStickyHeaderShrink";
import { useLanguage } from "../../../i18n/LanguageContext";
import { ScrambleText } from "../../common/ScrambleText/ScrambleText";
import { ExperienceItem } from "../ExperienceItem/ExperienceItem";
import styles from "./ExperiencesSection.module.css";

interface ExperiencesSectionProps {
  /** Forwarded to the underlying <section>, e.g. so a parent can track its scroll position. */
  containerRef?: Ref<HTMLElement>;
  /** Reports whenever this section's sticky header pins/unpins (e.g. so a sibling indicator can shrink in sync). */
  onStuckChange?: (stuck: boolean) => void;
}

/** Career-history section: sticky title band over a stacked list of ExperienceItem rows. */
export function ExperiencesSection({ containerRef, onStuckChange }: ExperiencesSectionProps) {
  const { t } = useLanguage();
  const experiences = t.experiences;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stuck = useStickyHeaderShrink(headerRef, sectionRef);
  const setSectionRef = useMergedRef(sectionRef, containerRef);

  useEffect(() => {
    onStuckChange?.(stuck);
  }, [stuck, onStuckChange]);

  return (
    <section id="experiences" ref={setSectionRef} className={styles.section}>
      <div ref={headerRef} className={stuck ? `${styles.header} ${styles.stuck}` : styles.header}>
        <h2 className={styles.title}>
          <ScrambleText text={t.expTitle} />
          <span className={styles.dot}>.</span>
        </h2>
      </div>
      <div className={styles.list}>
        {experiences.map((experience, i) => (
          <ExperienceItem
            key={experience.company}
            experience={experience}
            index={i}
            isLast={i === experiences.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
