import { useScrambleText } from "../../../hooks/useScrambleText/useScrambleText";
import { useLanguage } from "../../../i18n/LanguageContext";

interface ScrambleTextProps {
  text: string;
}

/**
 * Drop-in replacement for rendering translated text directly: briefly
 * scrambles through to the new value whenever the language switches.
 */
export function ScrambleText({ text }: ScrambleTextProps) {
  const { lang } = useLanguage();
  return <>{useScrambleText(text, lang)}</>;
}
