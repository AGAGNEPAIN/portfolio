import { fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LanguageProvider, readStoredLang, useLanguage } from "./LanguageContext";

function Probe() {
  const { lang, t, setLang } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="role">{t.heroRole}</span>
      <button type="button" onClick={() => setLang(lang === "fr" ? "en" : "fr")}>
        toggle
      </button>
    </div>
  );
}

describe("LanguageProvider / useLanguage", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "";
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("defaults to French", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("fr");
    expect(screen.getByTestId("role")).toHaveTextContent("Lead Développeur Full-Stack");
  });

  it("restores a previously stored language", () => {
    localStorage.setItem("ag-lang", "en");
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });

  it("ignores an invalid stored value and falls back to the default", () => {
    localStorage.setItem("ag-lang", "de");
    expect(readStoredLang()).toBeNull();
  });

  it("switches language, persists it, and updates <html lang>", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("role")).toHaveTextContent("Lead Full-Stack Developer");
    expect(localStorage.getItem("ag-lang")).toBe("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it("throws when used outside of a provider", () => {
    const Bare = () => {
      useLanguage();
      return null;
    };
    expect(() => render(<Bare />)).toThrow(/LanguageProvider/);
  });
});
