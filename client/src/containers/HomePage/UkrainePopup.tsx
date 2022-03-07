import React from "react";
import FButton from "../../components/FigmaUI/FButton/FButton";
import styles from "./UkrainePopup.module.scss";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";

const UkrainePopup = () => {
  return (
    <div className={styles.ukraine}>
      <p className={styles.text}>
        <span className={styles.blue}>Solidarité avec l’Ukraine 🇺🇦</span>
        <span>Portail d’information unique</span>
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
