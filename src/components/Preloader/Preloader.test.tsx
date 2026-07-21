import { render } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "../../i18n/LanguageContext";
import { Preloader } from "./Preloader";

function renderPreloader(onRevealLogo: () => void, onDone: () => void) {
  return render(
    <LanguageProvider>
      <Preloader onRevealLogo={onRevealLogo} onDone={onDone} />
    </LanguageProvider>,
  );
}

describe("Preloader", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the localized loading label", () => {
    vi.useFakeTimers();
    const { getByText } = renderPreloader(vi.fn(), vi.fn());
    expect(getByText("Chargement")).toBeInTheDocument();
  });

  it("does not call onRevealLogo or onDone before the minimum visible delay has elapsed", () => {
    vi.useFakeTimers();
    const onRevealLogo = vi.fn();
    const onDone = vi.fn();
    renderPreloader(onRevealLogo, onDone);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onRevealLogo).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });

  it("reveals the nav logo mid-wipe, then calls onDone once the wipe finishes", () => {
    vi.useFakeTimers();
    const onRevealLogo = vi.fn();
    const onDone = vi.fn();
    renderPreloader(onRevealLogo, onDone);

    // Min-visible delay (900ms) + the reveal-logo offset (950ms into the hide sequence).
    act(() => {
      vi.advanceTimersByTime(900 + 950);
    });
    expect(onRevealLogo).toHaveBeenCalledTimes(1);
    expect(onDone).not.toHaveBeenCalled();

    // Remaining time up to the removal offset (1200ms into the hide sequence).
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(onDone).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onRevealLogo).toHaveBeenCalledTimes(1);
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
