import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { AnimatedHeading } from "./AnimatedHeading";

describe("AnimatedHeading", () => {
  it("exposes the exact given text (with spaces intact) as its accessible name", () => {
    const text = "Antoine Gagnepain.";
    const { container } = render(<AnimatedHeading text={text} />);
    const heading = container.querySelector("h1");
    expect(heading).toHaveAccessibleName(text);
  });

  it("hides the decorative per-letter markup from assistive tech", () => {
    const { container } = render(<AnimatedHeading text="Antoine Gagnepain." />);
    const decorative = container.querySelector("h1 > [aria-hidden='true']");
    expect(decorative).toBeInTheDocument();
    expect(decorative?.textContent?.replace(/\s/g, "")).toBe("AntoineGagnepain.");
  });

  it("renders one decorative wrapper block per word", () => {
    const { container } = render(<AnimatedHeading text="Antoine Gagnepain." />);
    const decorative = container.querySelector("h1 > [aria-hidden='true']") as HTMLElement;
    expect(decorative.children).toHaveLength(2);
  });

  it("handles a single-word text with one decorative wrapper block", () => {
    const { container } = render(<AnimatedHeading text="Solo" />);
    const heading = container.querySelector("h1");
    expect(heading).toHaveAccessibleName("Solo");
    const decorative = container.querySelector("h1 > [aria-hidden='true']") as HTMLElement;
    expect(decorative.children).toHaveLength(1);
  });
});
