import { useTranslations } from "next-intl";
import Link from "next/link";
import { Event } from "~/lib/tracking";
import styles from "./Summary.module.scss";

/**
 * Summary for mobile version
 */
const Summary = () => {
  const t = useTranslations();
  return (
    <div className={styles.card}>
      <p className={styles.title}>{t("Dispositif.summary")}</p>
      <ol>
        <li className={styles.item}>
          <Link href="#anchor-who" onClick={() => Event("DISPO_VIEW", "click summary who", "Summary")}>
            {t("Dispositif.importantInformations")}
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="#anchor-what" onClick={() => Event("DISPO_VIEW", "click summary what", "Summary")}>
            {t("Dispositif.sectionWhatAndWhy")}
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="#anchor-how" onClick={() => Event("DISPO_VIEW", "click summary how", "Summary")}>
            {t("Dispositif.sectionHow")}
          </Link>
        </li>
      </ol>
    </div>
  );
};

export default Summary;
