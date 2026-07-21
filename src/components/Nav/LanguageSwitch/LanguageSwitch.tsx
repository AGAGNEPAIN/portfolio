import { useLanguage } from "../../../i18n/LanguageContext";
import type { Lang } from "../../../i18n/types";
import styles from "./LanguageSwitch.module.css";

const OPTIONS: Array<{ code: Lang; label: string }> = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

/** FR / EN toggle, rendered as a slash-separated pair of buttons. */
export function LanguageSwitch() {
  const { lang, setLang } = useLanguage();

  return (
    <div className={styles.wrap}>
      {OPTIONS.map(({ code, label }, i) => (
        <span key={code} className={styles.item}>
          {i > 0 && <span className={styles.divider}>/</span>}
          <button
            type="button"
            className={[styles.button, lang === code ? styles.active : styles.inactive].join(" ")}
            aria-pressed={lang === code}
            onClick={() => setLang(code)}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  );
}
