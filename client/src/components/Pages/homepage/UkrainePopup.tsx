import React from "react";
import { useTranslation } from "next-i18next";
import FButton from "components/UI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./UkrainePopup.module.scss";

const UkrainePopup = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.ukraine}>
      <p className={styles.text}>
        <span className={styles.title}>{t("ukraine_popup_title", "Solidarité avec l’Ukraine")} <span>🇺🇦</span></span>
        <span>{t("ukraine_popup_subtitle", "Portail de mobilisation et d’information")}</span>
      </p>

      <FButton
        type="login"
        className={styles.btn}
        tag="a"
        href="https://parrainage.refugies.info/?utm_source=popup&utm_medium=baniere&utm_campaign=ukraine"
        target="_blank"
      >
        parrainage.refugies.info
        <EVAIcon name="arrow-forward" className={styles.icon} />
      </FButton>
    </div>
  );
};

export default UkrainePopup;
