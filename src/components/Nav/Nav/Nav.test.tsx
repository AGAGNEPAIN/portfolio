import { render, screen } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LanguageProvider } from "../../../i18n/LanguageContext";
import agMarkStyles from "../../icons/AgMark/AgMark.module.css";
import { Nav } from "./Nav";
import styles from "./Nav.module.css";

function setScrollY(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
}

function renderNav(props: { inverted?: boolean; animateLogo?: boolean } = {}) {
  return render(
    <LanguageProvider>
      <Nav {...props} />
    </LanguageProvider>,
  );
}

describe("Nav", () => {
  beforeEach(() => {
    localStorage.clear();
    setScrollY(0);
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("renders a logo link to #top and a contact link to #contact", () => {
    const { container } = renderNav();
    expect(container.querySelector('a[href="#top"]')).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "CONTACT" })).toHaveAttribute("href", "#contact");
  });

  it("switches to a compact class once scrolled past the threshold", () => {
    const { container } = renderNav();
    const nav = container.querySelector("nav") as HTMLElement;
    expect(nav.classList.contains(styles.compact)).toBe(false);

    setScrollY(120);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(nav.classList.contains(styles.compact)).toBe(true);
  });

  it("applies inverted styling when the inverted prop is true", () => {
    const { container: normal } = renderNav({ inverted: false });
    const { container: inverted } = renderNav({ inverted: true });
    const normalNav = normal.querySelector("nav") as HTMLElement;
    const invertedNav = inverted.querySelector("nav") as HTMLElement;
    expect(normalNav.classList.contains(styles.inverted)).toBe(false);
    expect(invertedNav.classList.contains(styles.inverted)).toBe(true);
  });

  it("keeps the logo static by default and plays its stroke-in once animateLogo is true", () => {
    const { container: idle } = renderNav({ animateLogo: false });
    const { container: ready } = renderNav({ animateLogo: true });
    const idlePath = idle.querySelector("svg path") as SVGPathElement;
    const readyPath = ready.querySelector("svg path") as SVGPathElement;
    expect(idlePath.getAttribute("class")).toContain(agMarkStyles.pathStatic);
    expect(readyPath.getAttribute("class")).toContain(agMarkStyles.pathAnimated);
  });
});
