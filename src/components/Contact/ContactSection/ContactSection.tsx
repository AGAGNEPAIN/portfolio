import { useLanguage } from "../../../i18n/LanguageContext";
import { SOCIAL_LINKS } from "../../../lib/constants/constants";
import { AvailabilityDot } from "../../common/AvailabilityDot/AvailabilityDot";
import { ScrambleText } from "../../common/ScrambleText/ScrambleText";
import { DownloadIcon } from "../../icons/DownloadIcon/DownloadIcon";
import { GithubIcon } from "../../icons/GithubIcon/GithubIcon";
import { LinkedinIcon } from "../../icons/LinkedinIcon/LinkedinIcon";
import { CopyEmailButton } from "../CopyEmailButton/CopyEmailButton";
import { LocalClock } from "../LocalClock/LocalClock";
import styles from "./ContactSection.module.css";

/** Closing contact/footer section: pitch, email, CV/social links, footer meta. */
export function ContactSection() {
  const { t, lang } = useLanguage();

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.topRow}>
        <span className={styles.label}>
          <ScrambleText text={t.contactLabel} />
        </span>
        <span className={styles.availCluster}>
          <AvailabilityDot size={10} />
          <ScrambleText text={t.contactAvail} />
          <span aria-hidden="true">/</span>
          <span className={styles.reply}>
            <ScrambleText text={t.contactReply} />
          </span>
        </span>
      </div>

      <h2 className={styles.title}>
        <ScrambleText text={t.contactTitle} />
      </h2>
      <p className={styles.sub}>
        <ScrambleText text={t.contactSub} />
      </p>

      <CopyEmailButton />

      <div className={styles.linkRow}>
        <a
          className={`${styles.pill} ${styles.pillAccent}`}
          href={`${import.meta.env.BASE_URL}Antoine-Gagnepain_CV_${lang}.pdf`}
          download={lang === "fr" ? "Antoine Gagnepain - CV.pdf" : "Antoine Gagnepain - Resume.pdf"}
        >
          <DownloadIcon />
          <ScrambleText text={t.cvLabel} />
        </a>
        <a
          className={styles.pill}
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noreferrer noopener"
        >
          <LinkedinIcon />
          LinkedIn
        </a>
        <a
          className={styles.pill}
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noreferrer noopener"
        >
          <GithubIcon />
          GitHub
        </a>
      </div>

      <div className={styles.bottomRow}>
        <span>© 2026 Antoine Gagnepain</span>
        <span>
          <ScrambleText text={t.localLabel} /> <LocalClock />
        </span>
        <span>
          <ScrambleText text={t.footerNote} />
        </span>
      </div>
    </footer>
  );
}
