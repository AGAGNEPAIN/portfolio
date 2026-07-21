import { describe, expect, it } from "vitest";
import type { StackGroup } from "../../i18n/types";
import { getStackTiles } from "./stack";

const groups: StackGroup[] = [
  {
    key: "frontend",
    items: [
      { name: "TypeScript", level: "expert" },
      { name: "Vue", level: "advanced" },
    ],
  },
  {
    key: "backend",
    items: [{ name: "Docker", level: "solid" }],
  },
];

const groupLabels = {
  frontend: "Frontend",
  backend: "Backend",
  monitoring: "Monitoring",
  ai: "AI",
};
const levelLabels = { expert: "Expert", advanced: "Advanced", solid: "Solid" };

describe("getStackTiles", () => {
  it("flattens groups into indexed tiles", () => {
    const tiles = getStackTiles(groups, groupLabels, levelLabels);
    expect(tiles).toHaveLength(3);
    expect(tiles.map((t) => t.idx)).toEqual(["01", "02", "03"]);
  });

  it("resolves level label and width per item", () => {
    const [ts] = getStackTiles(groups, groupLabels, levelLabels);
    expect(ts.levelLabel).toBe("Expert");
    expect(ts.widthPct).toBe(100);
  });

  it("assigns a distinct color per group and carries the group label", () => {
    const tiles = getStackTiles(groups, groupLabels, levelLabels);
    expect(tiles[0].categoryLabel).toBe("Frontend");
    expect(tiles[2].categoryLabel).toBe("Backend");
    expect(tiles[0].color).not.toBe(tiles[2].color);
  });

  it("returns an empty array for no groups", () => {
    expect(getStackTiles([], groupLabels, levelLabels)).toEqual([]);
  });
});
