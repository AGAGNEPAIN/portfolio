import { render } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "../../../i18n/LanguageContext";
import type { Experience } from "../../../i18n/types";
import { ExperienceItem } from "./ExperienceItem";
import styles from "./ExperienceItem.module.css";

const experience: Experience = {
  index: "01",
  company: "Acme Corp",
  role: "Lead Engineer",
  place: "Remote",
  period: "2020 — 2024",
  summary: "Built things that matter for a lot of people.",
  points: [
    { label: "Products", text: "Shipped the core product end to end." },
    { label: "Architecture", text: "Rebuilt the stack from scratch." },
  ],
};

function renderWithProvider(children: ComponentChildren) {
  return render(<LanguageProvider>{children}</LanguageProvider>);
}

describe("ExperienceItem", () => {
  beforeEach(() => {
    // jsdom has no real matchMedia/IntersectionObserver; stub both so the
    // mobile-layout and scroll-reveal hooks used inside ExperienceItem don't throw.
    // useIsMobile's underlying useMediaQuery also subscribes via addEventListener.
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof window.matchMedia;
    // @ts-expect-error - minimal mock is enough to avoid the missing-API crash in jsdom
    window.IntersectionObserver = class {
      observe = vi.fn();
      disconnect = vi.fn();
    };
  });

  it("renders company, period, role/place and summary", () => {
    const { getByText } = renderWithProvider(<ExperienceItem experience={experience} index={0} />);
    expect(getByText("Acme Corp")).toBeInTheDocument();
    expect(getByText("2020 — 2024")).toBeInTheDocument();
    expect(getByText("Lead Engineer — Remote")).toBeInTheDocument();
    expect(getByText(experience.summary)).toBeInTheDocument();
  });

  it("renders no point labels when points is empty", () => {
    const { container } = renderWithProvider(
      <ExperienceItem experience={{ ...experience, points: [] }} index={0} />,
    );
    expect(container.getElementsByClassName(styles.pointLabel)).toHaveLength(0);
  });

  it("renders a label/text pair for each point", () => {
    const { getByText } = renderWithProvider(<ExperienceItem experience={experience} index={0} />);
    for (const point of experience.points) {
      expect(getByText(point.label)).toBeInTheDocument();
      expect(getByText(point.text)).toBeInTheDocument();
    }
  });

  it("drops the border-bottom class when isLast is true", () => {
    const { container: middle } = renderWithProvider(
      <ExperienceItem experience={experience} index={0} />,
    );
    const { container: last } = renderWithProvider(
      <ExperienceItem experience={experience} index={0} isLast />,
    );
    expect(middle.querySelector("article")?.classList.contains(styles.last)).toBe(false);
    expect(last.querySelector("article")?.classList.contains(styles.last)).toBe(true);
  });
});
