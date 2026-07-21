import type { Ref } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { useInViewOnce } from "../../../hooks/useInViewOnce/useInViewOnce";
import { useMediaQuery } from "../../../hooks/useMediaQuery/useMediaQuery";
import { useMergedRef } from "../../../hooks/useMergedRef/useMergedRef";
import { useScrollEntryProgress } from "../../../hooks/useScrollEntryProgress/useScrollEntryProgress";
import { useStackTileInteractions } from "../../../hooks/useStackTileInteractions/useStackTileInteractions";
import { useStickyHeaderShrink } from "../../../hooks/useStickyHeaderShrink/useStickyHeaderShrink";
import { useLanguage } from "../../../i18n/LanguageContext";
import { STACK_GROUPS } from "../../../i18n/content";
import { easeOutQuint } from "../../../lib/easing/easing";
import { getStackTiles } from "../../../lib/stack/stack";
import { ScrambleText } from "../../common/ScrambleText/ScrambleText";
import { StackTile } from "../StackTile/StackTile";
import styles from "./StackSection.module.css";

/** Matches the reference's `animation-range: entry 0% entry 42%`. */
const ENTRY_FRACTION = 0.42;

interface StackSectionProps {
  containerRef?: Ref<HTMLElement>;
  /** Reports whenever this section's sticky header pins/unpins (e.g. so a sibling indicator can shrink in sync). */
  onStuckChange?: (stuck: boolean) => void;
}

/**
 * Skills/stack section. Deliberately inverts the site's racing-green-on-cream
 * scheme to cream-on-dark, and reveals in as it scrolls into view.
 *
 * `containerRef` (if provided) is forwarded to the underlying <section>, so a
 * parent can observe its position for e.g. a nav color-invert effect.
 */
export function StackSection({ containerRef, onStuckChange }: StackSectionProps) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const stuck = useStickyHeaderShrink(headerRef, sectionRef);
  const gridEntered = useInViewOnce(gridRef, { threshold: 0.15 });
  const tiles = getStackTiles(STACK_GROUPS, t.groupLabels, t.levelLabels);
  useStackTileInteractions(gridRef);
  const setSectionRef = useMergedRef(sectionRef, containerRef);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const rawEntryProgress = useScrollEntryProgress(sectionRef, ENTRY_FRACTION);
  // The reference eases this with cubic-bezier(.16,1,.3,1) (--ease-out-quint),
  // which front-loads almost the entire reveal into roughly the first quarter
  // of the entry range — a linear mapping felt noticeably slower/later.
  const entryProgress = reducedMotion ? 1 : easeOutQuint(rawEntryProgress);

  useEffect(() => {
    onStuckChange?.(stuck);
  }, [stuck, onStuckChange]);

  return (
    <section
      id="stack"
      ref={setSectionRef}
      className={styles.section}
      // Scroll-linked reveal (not a one-shot IntersectionObserver trigger):
      // clip-path tracks this section's own scroll position continuously via
      // a scroll listener, so its cream background *and* content clip and
      // reveal together as one unit — matching the reference's
      // `animation-timeline: view()` motion without depending on that CSS
      // feature's browser support.
      style={{ clipPath: `inset(${(1 - entryProgress) * 100}% 0 0 0)` }}
    >
      <header
        ref={headerRef}
        className={stuck ? `${styles.header} ${styles.stuck}` : styles.header}
      >
        <h2 className={styles.title}>
          <ScrambleText text={t.stackTitle} />.
        </h2>
      </header>
      <div className={styles.grid} ref={gridRef}>
        {tiles.map((tile, index) => (
          <StackTile key={tile.idx} tile={tile} index={index} entered={gridEntered} />
        ))}
      </div>
    </section>
  );
}
