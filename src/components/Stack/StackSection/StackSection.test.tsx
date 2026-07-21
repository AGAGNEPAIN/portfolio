import { render, screen } from "@testing-library/preact";
import { createRef } from "preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "../../../i18n/LanguageContext";
import { STACK_GROUPS, TRANSLATIONS } from "../../../i18n/content";
import { getStackTiles } from "../../../lib/stack/stack";
import { StackSection } from "./StackSection";

describe("StackSection", () => {
  beforeEach(() => {
    // jsdom has no real matchMedia/IntersectionObserver; stub both so the
    // hooks used inside StackSection and every StackTile don't throw.
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

  it("renders the section title for the current language", () => {
    render(
      <LanguageProvider>
        <StackSection />
      </LanguageProvider>,
    );
    expect(screen.getByText(`${TRANSLATIONS.fr.stackTitle}.`)).toBeInTheDocument();
  });

  it("renders one StackTile per entry from getStackTiles", () => {
    render(
      <LanguageProvider>
        <StackSection />
      </LanguageProvider>,
    );
    const tiles = getStackTiles(
      STACK_GROUPS,
      TRANSLATIONS.fr.groupLabels,
      TRANSLATIONS.fr.levelLabels,
    );
    expect(tiles.length).toBeGreaterThan(0);
    for (const tile of tiles) {
      expect(screen.getByText(tile.name)).toBeInTheDocument();
    }
  });

  it("forwards containerRef to the underlying section element", () => {
    const ref = createRef<HTMLElement>();
    render(
      <LanguageProvider>
        <StackSection containerRef={ref} />
      </LanguageProvider>,
    );
    expect(ref.current?.tagName).toBe("SECTION");
    expect(ref.current?.id).toBe("stack");
  });
});
