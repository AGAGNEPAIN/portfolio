import { render, screen } from "@testing-library/preact";
import { act } from "preact/test-utils";
import { describe, expect, it, vi } from "vitest";
import { LanguageProvider, useLanguage } from "../../../i18n/LanguageContext";
import { ScrambleText } from "./ScrambleText";

function stubAnimationFrame() {
  const callbacks: FrameRequestCallback[] = [];
  window.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => {
    callbacks.push(cb);
    return callbacks.length;
  }) as unknown as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = vi.fn();
  return {
    tick: (times = 1) => {
      for (let i = 0; i < times; i++) {
        const due = callbacks.splice(0, callbacks.length);
        for (const cb of due) cb(0);
      }
    },
  };
}

function Harness() {
  const { t, setLang } = useLanguage();
  return (
    <div>
      <ScrambleText text={t.heroAvail} />
      <button type="button" onClick={() => setLang("en")}>
        switch
      </button>
    </div>
  );
}

describe("ScrambleText", () => {
  it("renders the current translation directly on first render", () => {
    stubAnimationFrame();
    render(
      <LanguageProvider>
        <ScrambleText text="Disponible" />
      </LanguageProvider>,
    );
    expect(screen.getByText("Disponible")).toBeInTheDocument();
  });

  it("scrambles then resolves to the new language's text after a switch", () => {
    const raf = stubAnimationFrame();
    const { container } = render(
      <LanguageProvider>
        <Harness />
      </LanguageProvider>,
    );
    expect(container.textContent).toContain("Disponible");

    act(() => {
      (container.querySelector("button") as HTMLButtonElement).click();
    });
    act(() => raf.tick(60));

    expect(container.textContent).toContain("Available");
  });
});
