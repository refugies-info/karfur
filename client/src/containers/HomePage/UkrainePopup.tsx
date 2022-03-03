import React from "react";
import FButton from "../../components/FigmaUI/FButton/FButton";
import styles from "./UkrainePopup.module.scss";
import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";

const UkrainePopup = () => {
  return (
    <div className={styles.ukraine}>
      <h4>Solidarité avec l’Ukraine 🇺🇦</h4>
      <p className="mb-2">
        <span className={styles.text}>
          🇺🇦 Vous êtes ressortissant ukrainien ?
        </span>
        <FButton type="login" className={styles.btn}>
          Trouver de l’information traduite
          <EVAIcon name="arrow-forward" className={styles.icon} />
        </FButton>
      </p>
      <p className="mb-0">
        <span className={styles.text}>🇫🇷 Vous voulez aider en France ?</span>
        <FButton type="login" className={styles.btn}>
          M’engager avec une association
          <EVAIcon name="arrow-forward" className={styles.icon} />
        </FButton>
      </p>
    </div>
  );
};

export default UkrainePopup;
