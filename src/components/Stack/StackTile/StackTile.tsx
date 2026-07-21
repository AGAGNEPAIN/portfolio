import type { StackTileInfo } from "../../../lib/stack/stack";
import styles from "./StackTile.module.css";

interface StackTileProps {
  tile: StackTileInfo;
  index: number;
  /** Whether the whole grid has entered view — drives the cascading entrance. */
  entered: boolean;
}

/**
 * Single skill card for the inverted-scheme stack section: dark card, a top
 * border in the tile's category color, and a level bar. Pointer-follow
 * magnetism and click-flip are applied imperatively by
 * `useStackTileInteractions` on the grid, targeting `[data-tile]`.
 */
export function StackTile({ tile, index, entered }: StackTileProps) {
  return (
    <div
      className={entered ? `${styles.wrap} ${styles.visible}` : styles.wrap}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div
        className={styles.tile}
        data-tile
        style={{ borderTopColor: tile.color }}
        data-testid="stack-tile"
      >
        <div className={styles.top}>
          <span style={{ color: tile.color }}>{tile.idx}</span>
          <span className={styles.category}>{tile.categoryLabel}</span>
        </div>
        <p className={styles.name}>{tile.name}</p>
        <div className={styles.bottom}>
          <div className={styles.track}>
            <div
              className={styles.bar}
              style={{ width: `${tile.widthPct}%`, background: tile.color }}
              data-testid="stack-tile-bar"
            />
          </div>
          <span className={styles.level}>{tile.levelLabel}</span>
        </div>
      </div>
    </div>
  );
}
