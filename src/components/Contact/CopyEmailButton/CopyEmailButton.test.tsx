import { fireEvent, render, screen } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "../../../i18n/LanguageContext";
import { CONTACT_EMAIL } from "../../../lib/constants/constants";
import { CopyEmailButton } from "./CopyEmailButton";

describe("CopyEmailButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders the contact email", () => {
    render(
      <LanguageProvider>
        <CopyEmailButton />
      </LanguageProvider>,
    );
    expect(screen.getByText(CONTACT_EMAIL)).toBeInTheDocument();
  });

  it("copies the email and flips the label to 'copied' then back after the reset delay", async () => {
    render(
      <LanguageProvider>
        <CopyEmailButton />
      </LanguageProvider>,
    );

    expect(screen.getByText("Copier")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
      // Flush the microtasks inside useCopyToClipboard's async copy().
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(CONTACT_EMAIL);
    expect(screen.getByText("Copié ✓")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(screen.getByText("Copier")).toBeInTheDocument();
  });
});
