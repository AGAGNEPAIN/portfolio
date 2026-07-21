import { render, screen } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "../../../i18n/LanguageContext";
import { TRANSLATIONS } from "../../../i18n/content";
import { COORDINATES } from "../../../lib/constants/constants";
import { Hero } from "./Hero";

function mockMatchMedia(matches: boolean) {
  const mql = {
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  window.matchMedia = vi.fn().mockReturnValue(mql) as unknown as typeof window.matchMedia;
}

function mockMatchMediaByQuery(matchingQueries: string[]) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matchingQueries.includes(query),
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

describe("Hero", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("renders the role, pitch and stats copy for the current language on desktop", () => {
    mockMatchMedia(false);
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>,
    );

    const t = TRANSLATIONS.fr;
    expect(screen.getByText(t.heroRole)).toBeInTheDocument();
    expect(screen.getByText(t.heroPitch)).toBeInTheDocument();
    expect(screen.getByText(t.heroSince)).toBeInTheDocument();
    expect(screen.getByText(t.heroLangs)).toBeInTheDocument();
    expect(screen.getByText("TypeScript & PHP")).toBeInTheDocument();
    expect(screen.getByText(COORDINATES)).toBeInTheDocument();
  });

  it("renders the AnimatedHeading, TechMarquee and PortraitCard", () => {
    mockMatchMedia(false);
    const { container } = render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>,
    );

    const heading = container.querySelector("h1");
    expect(heading).toHaveAccessibleName("Antoine Gagnepain.");
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Antoine Gagnepain" })).toBeInTheDocument();
  });

  it("hides the pitch quote and coordinates on mobile", () => {
    mockMatchMedia(true);
    const t = TRANSLATIONS.fr;
    render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>,
    );

    expect(screen.queryByText(t.heroPitch)).not.toBeInTheDocument();
    expect(screen.queryByText(COORDINATES)).not.toBeInTheDocument();
  });

  it("tilts the name toward the pointer on fine-pointer devices", () => {
    mockMatchMediaByQuery(["(hover: hover) and (pointer: fine)"]);
    const { container } = render(
      <LanguageProvider>
        <Hero />
      </LanguageProvider>,
    );
    const header = container.querySelector("header") as HTMLElement;
    header.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
    const nameWrap = header.querySelector("h1")?.parentElement as HTMLElement;

    expect(nameWrap.style.transform).toContain("rotateY(0deg)");

    act(() => {
      header.dispatchEvent(new MouseEvent("mousemove", { clientX: 100, clientY: 0 }));
    });
    expect(nameWrap.style.transform).toContain("rotateY(7deg)");
  });
});
