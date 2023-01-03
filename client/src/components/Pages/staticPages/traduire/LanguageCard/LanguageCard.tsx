import React from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { cls } from "lib/classname";
import { NeedKey } from "pages/traduire";
import { langueSelector } from "services/Langue/langue.selectors";
import styles from "./LanguageCard.module.scss";

interface Props {
  languageId: string;
  need: NeedKey;
}

const LanguageCard = (props: Props) => {
  const { t } = useTranslation();
  const language = useSelector(langueSelector(props.languageId));

  return (
    <div className={cls(styles.container)}>
      <div className={styles.title}>
        <span className={cls(styles.flag, "fi fi-" + language?.langueCode)} title={language?.langueCode} />
        {language?.langueFr}
      </div>
      <p className={styles.subtitle}>
        {t("Translate.need")}{" "}
        <span className={cls(styles.need, styles[props.need])}>{t(`Translate.${props.need}`)}</span>
      </p>
    </div>
  );
};

export default LanguageCard;
