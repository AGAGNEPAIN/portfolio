import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider, useLanguage } from "../../../i18n/LanguageContext";
import { SOCIAL_LINKS } from "../../../lib/constants/constants";
import { ContactSection } from "./ContactSection";

beforeEach(() => {
  localStorage.clear();
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia;
});

function LanguageSwitchButton() {
  const { lang, setLang } = useLanguage();
  return (
    <button type="button" onClick={() => setLang(lang === "fr" ? "en" : "fr")}>
      toggle
    </button>
  );
}

describe("ContactSection", () => {
  it("renders the contact label, title and sub copy for the current language", () => {
    render(
      <LanguageProvider>
        <ContactSection />
      </LanguageProvider>,
    );
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Un produit à construire ?")).toBeInTheDocument();
    expect(
      screen.getByText(/Disponible pour un poste de Senior, Lead ou Staff Engineer/),
    ).toBeInTheDocument();
  });

  it("renders the CV link with the French href by default and swaps to English", () => {
    const { container } = render(
      <LanguageProvider>
        <LanguageSwitchButton />
        <ContactSection />
      </LanguageProvider>,
    );
    const cvLink = screen.getByText("Télécharger le CV").closest("a") as HTMLAnchorElement;
    expect(cvLink).toHaveAttribute("href", "/Antoine-Gagnepain_CV_fr.pdf");
    expect(cvLink).toHaveAttribute("download");

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    // The label scramble-transitions on language switch, so locate the link
    // by its stable `download` attribute rather than by (transient) text.
    const cvLinkEn = container.querySelector("a[download]") as HTMLAnchorElement;
    expect(cvLinkEn).toHaveAttribute("href", "/Antoine-Gagnepain_CV_en.pdf");
  });

  it("renders the LinkedIn and GitHub social links with correct hrefs", () => {
    render(
      <LanguageProvider>
        <ContactSection />
      </LanguageProvider>,
    );
    const linkedin = screen.getByText("LinkedIn").closest("a") as HTMLAnchorElement;
    expect(linkedin).toHaveAttribute("href", SOCIAL_LINKS.linkedin);
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin.getAttribute("rel")).toContain("noopener");

    const github = screen.getByText("GitHub").closest("a") as HTMLAnchorElement;
    expect(github).toHaveAttribute("href", SOCIAL_LINKS.github);
    expect(github).toHaveAttribute("target", "_blank");
    expect(github.getAttribute("rel")).toContain("noopener");
  });

  it("renders the copyright and footer note", () => {
    render(
      <LanguageProvider>
        <ContactSection />
      </LanguageProvider>,
    );
    expect(screen.getByText("© 2026 Antoine Gagnepain")).toBeInTheDocument();
    expect(screen.getByText("Conçu avec 💚 et Claude")).toBeInTheDocument();
  });
});
