import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { TECH_MARQUEE_ITEMS } from "../../../lib/constants/constants";
import { TechMarquee } from "./TechMarquee";

describe("TechMarquee", () => {
  it("marks the root as aria-hidden since it duplicates visible content", () => {
    const { container } = render(<TechMarquee />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("renders every tech item at least twice for a seamless loop", () => {
    const { container } = render(<TechMarquee />);
    const text = container.textContent ?? "";
    for (const item of TECH_MARQUEE_ITEMS) {
      const occurrences = text.split(item).length - 1;
      expect(occurrences).toBeGreaterThanOrEqual(2);
    }
  });
});
