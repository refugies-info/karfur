import Link from "next/link";
import { useTranslation } from "next-i18next";
import React from "react";
import styles from "./Summary.module.scss";

/**
 * Summary for mobile version
 */
const Summary = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.card}>
      <p className={styles.title}>{t("Dispositif.summary")}</p>
      <ol>
        <li className={styles.item}>
          <Link href="#anchor-who">{t("Dispositif.importantInformations")}</Link>
        </li>
        <li className={styles.item}>
          <Link href="#anchor-what">{t("Dispositif.sectionWhatAndWhy")}</Link>
        </li>
        <li className={styles.item}>
          <Link href="#anchor-how">{t("Dispositif.sectionHow")}</Link>
        </li>
      </ol>
    </div>
  );
};

export default Summary;
