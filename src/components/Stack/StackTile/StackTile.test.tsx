import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import type { StackTileInfo } from "../../../lib/stack/stack";
import { StackTile } from "./StackTile";
import styles from "./StackTile.module.css";

const tile: StackTileInfo = {
  idx: "03",
  name: "TypeScript",
  levelLabel: "Expert",
  widthPct: 100,
  color: "#9bb515",
  categoryLabel: "Frontend",
};

/** Normalize a color string the same way jsdom's CSSOM does, for a stable comparison. */
function normalizeColor(color: string) {
  const probe = document.createElement("div");
  probe.style.color = color;
  return probe.style.color;
}

describe("StackTile", () => {
  it("renders the tile's idx, name, category and level labels", () => {
    render(<StackTile tile={tile} index={0} entered={false} />);
    expect(screen.getByText(tile.idx)).toBeInTheDocument();
    expect(screen.getByText(tile.name)).toBeInTheDocument();
    expect(screen.getByText(tile.categoryLabel)).toBeInTheDocument();
    expect(screen.getByText(tile.levelLabel)).toBeInTheDocument();
  });

  it("sizes the filled bar to the tile's widthPct", () => {
    render(<StackTile tile={tile} index={0} entered={false} />);
    const bar = screen.getByTestId("stack-tile-bar");
    expect(bar.style.width).toBe(`${tile.widthPct}%`);
  });

  it("colors the card's top border with the tile's color and marks it as a magnetic/click target", () => {
    render(<StackTile tile={tile} index={0} entered={false} />);
    const card = screen.getByTestId("stack-tile");
    expect(card.style.borderTopColor).toBe(normalizeColor(tile.color));
    expect(card).toHaveAttribute("data-tile");
  });

  it("plays the cascading entrance only once the grid has entered view", () => {
    const { container: idle } = render(<StackTile tile={tile} index={2} entered={false} />);
    const { container: entered } = render(<StackTile tile={tile} index={2} entered={true} />);
    expect((idle.firstChild as HTMLElement).classList.contains(styles.visible)).toBe(false);
    expect((entered.firstChild as HTMLElement).classList.contains(styles.visible)).toBe(true);
    expect((entered.firstChild as HTMLElement).style.animationDelay).toBe("180ms");
  });
});
