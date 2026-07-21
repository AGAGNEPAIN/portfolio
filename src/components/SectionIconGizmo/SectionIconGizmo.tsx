import { ICON_GEOMETRY, type SectionIconKey } from "../../lib/sectionIcon/sectionIcon";
import styles from "./SectionIconGizmo.module.css";

interface SectionIconGizmoProps {
  /** Which section's icon to show — `null` hides the gizmo entirely (e.g. over the hero or contact). */
  active: SectionIconKey | null;
  /** Whether the active section's sticky header is currently pinned — shrinks the icon to match. */
  stuck?: boolean;
}

/**
 * Small fixed indicator near the top-right of the viewport: 4 lines that
 * morph into a distinct shape for whichever section (experiences/stack) is
 * active. Driven by the same sticky-header "stuck" state as the shrink
 * effect (rather than its own independent scroll watch line), so it only
 * ever appears once that header is actually pinned at its fixed position —
 * otherwise the header can be anywhere in the flow and the icon (fixed
 * position) would visibly drift out of alignment with it.
 */
export function SectionIconGizmo({ active, stuck = false }: SectionIconGizmoProps) {
  // No lines at all while inactive (rather than pre-mounting `exp`'s geometry
  // hidden behind opacity 0): otherwise those lines are already "drawn" by
  // the time the icon first fades in, and the stroke draw-in never plays.
  const lines = active ? ICON_GEOMETRY[active] : [];

  const className = [
    styles.gizmo,
    active === "stack" ? styles.onLight : "",
    stuck ? styles.stuck : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{ opacity: active ? 1 : 0 }}
      aria-hidden="true"
    >
      {lines.map(([x1, y1, x2, y2], i) => (
        // Keyed by coordinates (not index) so changing `active` remounts every
        // line and re-triggers the draw-in animation.
        <line
          key={`${x1}-${y1}-${x2}-${y2}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          pathLength="1"
          className={styles.line}
          style={{ animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </svg>
  );
}
