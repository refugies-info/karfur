import React from "react";
import { useTranslation } from "react-i18next";
import FButton from "../../components/FigmaUI/FButton/FButton";
import styles from "./UkrainePopup.module.scss";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";

const UkrainePopup = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.ukraine}>
      <p className={styles.text}>
        <span className={styles.title}>{t("ukraine_popup_title", "Solidarité avec l’Ukraine")} <span>🇺🇦</span></span>
        <span>{t("ukraine_popup_subtitle", "Portail d’information unique")}</span>
      </p>

      <FButton
        type="login"
        className={styles.btn}
        tag="a"
        href="https://parrainage.refugies.info/"
        target="_blank"
      >
        ukraine.refugies.info
        <EVAIcon name="arrow-forward" className={styles.icon} />
      </FButton>
    </div>
  );
};

export default UkrainePopup;
