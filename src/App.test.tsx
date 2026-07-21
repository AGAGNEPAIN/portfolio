import { render, screen } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import navStyles from "./components/Nav/Nav/Nav.module.css";
import agMarkStyles from "./components/icons/AgMark/AgMark.module.css";
import { LanguageProvider } from "./i18n/LanguageContext";

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.IntersectionObserver = class {
      observe() {}
      disconnect() {}
      unobserve() {}
    } as unknown as typeof IntersectionObserver;
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as typeof window.matchMedia;
  });

  it("shows the preloader over the page, then removes it once done", () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>,
    );
    expect(document.querySelector("main")).toBeInTheDocument();
    expect(screen.getAllByText("Antoine", { exact: false }).length).toBeGreaterThan(0);
    expect(document.body.textContent).toMatch(/Chargement/);

    act(() => {
      vi.advanceTimersByTime(900);
    });
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(document.body.textContent).not.toMatch(/Chargement/);
  });

  it("renders every top-level section once loaded", () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>,
    );
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(document.getElementById("top")).toBeInTheDocument();
    expect(document.getElementById("experiences")).toBeInTheDocument();
    expect(document.getElementById("stack")).toBeInTheDocument();
    expect(document.getElementById("contact")).toBeInTheDocument();
  });

  it("inverts the nav once the stack section's rect covers the nav's watch line", () => {
    const { container } = render(
      <LanguageProvider>
        <App />
      </LanguageProvider>,
    );
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    const nav = container.querySelector("nav") as HTMLElement;
    const stackSection = document.getElementById("stack") as HTMLElement;
    expect(nav.classList.contains(navStyles.inverted)).toBe(false);

    stackSection.getBoundingClientRect = () => ({ top: 0, bottom: 800 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(nav.classList.contains(navStyles.inverted)).toBe(true);

    stackSection.getBoundingClientRect = () => ({ top: 900, bottom: 1600 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(nav.classList.contains(navStyles.inverted)).toBe(false);
  });

  it("plays the nav logo's stroke-in once the preloader finishes", () => {
    const { container } = render(
      <LanguageProvider>
        <App />
      </LanguageProvider>,
    );
    const navLogoPath = container.querySelector("nav svg path") as SVGPathElement;
    expect(navLogoPath.getAttribute("class")).toContain(agMarkStyles.pathStatic);

    act(() => {
      vi.advanceTimersByTime(900);
    });
    act(() => {
      vi.advanceTimersByTime(950);
    });

    expect(navLogoPath.getAttribute("class")).toContain(agMarkStyles.pathAnimated);
  });
});
