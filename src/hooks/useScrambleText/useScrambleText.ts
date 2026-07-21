import { useEffect, useRef, useState } from "preact/hooks";
import { computeScrambleDuration, renderScrambledFrame } from "../../lib/scramble/scramble";

/**
 * Displays `text`, scrambling briefly through to reveal it left-to-right
 * whenever `triggerKey` changes (e.g. the current language) — skipped on the
 * very first render, so the page doesn't scramble-in on initial load.
 */
export function useScrambleText(text: string, triggerKey: unknown): string {
  const [displayed, setDisplayed] = useState(text);
  const isFirstRun = useRef(true);

  // Intentionally keyed on `triggerKey` alone: the animation should restart
  // only on an explicit trigger (language switch), not on every `text` change.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see comment above.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      setDisplayed(text);
      return;
    }

    const duration = computeScrambleDuration(text.length);
    let frame = 0;
    let raf: number;

    const tick = () => {
      frame++;
      const revealCount = Math.floor((frame / duration) * text.length);
      setDisplayed(renderScrambledFrame(text, revealCount, frame));
      if (frame < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplayed(text);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [triggerKey]);

  return displayed;
}
