import styles from "./AnimatedHeading.module.css";

interface AnimatedHeadingProps {
  text: string;
}

const STAGGER_SECONDS = 0.04;

/**
 * Big display headline where every character rises into place, masked by an
 * overflow:hidden wrapper per word so each word sits on its own line.
 */
export function AnimatedHeading({ text }: AnimatedHeadingProps) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const totalChars = words.reduce((sum, word) => sum + word.length, 0);

  let charIndex = 0;

  return (
    <h1 className={styles.heading}>
      <span className={styles.srOnly}>{text}</span>
      <span aria-hidden="true" className={styles.decorative}>
        {words.map((word, wordIdx) => (
          <span className={styles.line} key={`${wordIdx}-${word}`}>
            {word.split("").map((char, letterIdx) => {
              const index = charIndex;
              charIndex += 1;
              const isLast = index === totalChars - 1;
              return (
                <span
                  key={`${letterIdx}-${char}`}
                  className={isLast ? `${styles.letter} ${styles.accent}` : styles.letter}
                  style={{ animationDelay: `${index * STAGGER_SECONDS}s` }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </h1>
  );
}
