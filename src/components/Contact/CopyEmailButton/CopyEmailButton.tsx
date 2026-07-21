import { useCopyToClipboard } from "../../../hooks/useCopyToClipboard/useCopyToClipboard";
import { useScrambleText } from "../../../hooks/useScrambleText/useScrambleText";
import { useLanguage } from "../../../i18n/LanguageContext";
import { CONTACT_EMAIL } from "../../../lib/constants/constants";
import styles from "./CopyEmailButton.module.css";

/** Full-width button that copies CONTACT_EMAIL to the clipboard on click. */
export function CopyEmailButton() {
  const { t, lang } = useLanguage();
  const { copied, copy } = useCopyToClipboard();
  // Each variant scrambles independently on language switch; `copied` just
  // picks which already-resolved text is shown, with no scramble of its own.
  const copyLabel = useScrambleText(t.copyLabel, lang);
  const copiedLabel = useScrambleText(t.copiedLabel, lang);

  return (
    <button type="button" className={styles.button} onClick={() => copy(CONTACT_EMAIL)}>
      <span className={styles.email}>{CONTACT_EMAIL}</span>
      <span className={styles.copyCluster}>
        <span className={styles.copyLabel} aria-live="polite">
          {copied ? copiedLabel : copyLabel}
        </span>
        <span aria-hidden="true">⧉</span>
      </span>
    </button>
  );
}
