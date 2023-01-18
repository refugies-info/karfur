import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { cls } from "lib/classname";
import { smoothScroll } from "lib/smoothScroll";
import { NeedKey } from "pages/traduire";
import { langueSelector } from "services/Langue/langue.selectors";
import styles from "./LanguageCard.module.scss";

interface Props {
  languageId: string;
  need: NeedKey;
  href: string;
}

const LanguageCard = (props: Props) => {
  const { t } = useTranslation();
  const language = useSelector(langueSelector(props.languageId));

  return (
    <Link href={props.href} className={styles.container} onClick={smoothScroll}>
      <div className={styles.title}>
        <span className={cls(styles.flag, "fi fi-" + language?.langueCode)} title={language?.langueCode} />
        {language?.langueFr}
      </div>
      <p className={styles.subtitle}>
        {t("Translate.need")}{" "}
        <span className={cls(styles.need, styles[props.need])}>{t(`Translate.${props.need}`)}</span>
      </p>
    </Link>
  );
};

export default LanguageCard;
