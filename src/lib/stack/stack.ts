import type { SkillLevel, StackGroup, StackGroupKey } from "../../i18n/types";

export interface StackTileInfo {
  idx: string;
  name: string;
  levelLabel: string;
  widthPct: number;
  color: string;
  categoryLabel: string;
}

const TILE_COLORS = ["#9bb515", "#5fa98a", "#c9a24b", "#efead8"];

export const LEVEL_WIDTH: Record<SkillLevel, number> = {
  expert: 100,
  advanced: 75,
  solid: 55,
};

export function getStackTiles(
  groups: StackGroup[],
  groupLabels: Record<StackGroupKey, string>,
  levelLabels: Record<SkillLevel, string>,
): StackTileInfo[] {
  const tiles: StackTileInfo[] = [];
  groups.forEach((group, groupIndex) => {
    const color = TILE_COLORS[groupIndex % TILE_COLORS.length];
    for (const item of group.items) {
      tiles.push({
        idx: String(tiles.length + 1).padStart(2, "0"),
        name: item.name,
        levelLabel: levelLabels[item.level],
        widthPct: LEVEL_WIDTH[item.level],
        color,
        categoryLabel: groupLabels[group.key],
      });
    }
  });
  return tiles;
}
