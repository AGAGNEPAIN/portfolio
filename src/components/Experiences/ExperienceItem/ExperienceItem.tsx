import { useRef } from "preact/hooks";
import { useInViewOnce } from "../../../hooks/useInViewOnce/useInViewOnce";
import { useIsMobile } from "../../../hooks/useIsMobile/useIsMobile";
import type { Experience } from "../../../i18n/types";
import { ScrambleText } from "../../common/ScrambleText/ScrambleText";
import styles from "./ExperienceItem.module.css";

interface ExperienceItemProps {
  experience: Experience;
  /** Position of this item within the rendered list — drives the fade-in stagger delay only. */
  index: number;
  isLast?: boolean;
}

/**
 * One career-history row: index label, company/role/place/period header,
 * summary and (optionally) a grid of highlight points. Fades up once it
 * scrolls into view, staggered by its list position.
 */
export function ExperienceItem({ experience, index, isLast = false }: ExperienceItemProps) {
  const rootRef = useRef<HTMLElement>(null);
  const inView = useInViewOnce(rootRef, { threshold: 0.15 });
  const isMobile = useIsMobile();

  const rootClassName = [
    styles.item,
    isMobile && styles.mobile,
    isLast && styles.last,
    inView && styles.visible,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article ref={rootRef} className={rootClassName} style={{ animationDelay: `${index * 100}ms` }}>
      <div className={styles.indexCol}>{experience.index}</div>
      <div className={styles.content}>
        <div className={styles.headRow}>
          <h3 className={styles.company}>{experience.company}</h3>
          <span className={styles.period}>
            <ScrambleText text={experience.period} />
          </span>
        </div>
        <p className={styles.roleLine}>
          <ScrambleText text={experience.role} /> — <ScrambleText text={experience.place} />
        </p>
        <p className={styles.summary}>
          <ScrambleText text={experience.summary} />
        </p>
        {experience.points.length > 0 && (
          <div className={styles.points}>
            {experience.points.map((point, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static per-experience list, order never changes; point.label/text are translated and unstable across languages.
              <div key={i} className={styles.point}>
                <span className={styles.pointLabel}>
                  <ScrambleText text={point.label} />
                </span>
                <p className={styles.pointText}>
                  <ScrambleText text={point.text} />
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
