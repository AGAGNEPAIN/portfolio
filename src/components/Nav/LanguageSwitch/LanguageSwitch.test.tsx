import { fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LanguageProvider } from "../../../i18n/LanguageContext";
import { LanguageSwitch } from "./LanguageSwitch";

describe("LanguageSwitch", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("renders both FR and EN buttons separated by a slash", () => {
    render(
      <LanguageProvider>
        <LanguageSwitch />
      </LanguageProvider>,
    );
    expect(screen.getByRole("button", { name: "FR" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
  });

  it("marks FR active and EN inactive by default", () => {
    render(
      <LanguageProvider>
        <LanguageSwitch />
      </LanguageProvider>,
    );
    expect(screen.getByRole("button", { name: "FR" }).className).toMatch(/active/);
    expect(screen.getByRole("button", { name: "EN" }).className).toMatch(/inactive/);
  });

  it("calls setLang and swaps the active button when clicking EN", () => {
    render(
      <LanguageProvider>
        <LanguageSwitch />
      </LanguageProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    expect(screen.getByRole("button", { name: "EN" }).className).toMatch(/active/);
    expect(screen.getByRole("button", { name: "FR" }).className).toMatch(/inactive/);
  });
});
