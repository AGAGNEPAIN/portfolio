import { render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "../../../i18n/LanguageContext";
import { TRANSLATIONS } from "../../../i18n/content";
import { ExperiencesSection } from "./ExperiencesSection";

describe("ExperiencesSection", () => {
  beforeEach(() => {
    // jsdom has no real matchMedia/IntersectionObserver; stub both so the
    // hooks used inside ExperiencesSection and every ExperienceItem don't throw.
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

  it("renders the section title for the current (default, French) language", () => {
    render(
      <LanguageProvider>
        <ExperiencesSection />
      </LanguageProvider>,
    );
    expect(screen.getByText(TRANSLATIONS.fr.expTitle)).toBeInTheDocument();
  });

  it("renders one item per experience in the current language's translation", () => {
    const { container } = render(
      <LanguageProvider>
        <ExperiencesSection />
      </LanguageProvider>,
    );
    expect(container.querySelectorAll("article")).toHaveLength(TRANSLATIONS.fr.experiences.length);
    for (const experience of TRANSLATIONS.fr.experiences) {
      expect(screen.getByText(experience.company)).toBeInTheDocument();
    }
  });
});
