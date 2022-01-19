import React from "react";
import { useTranslation } from "react-i18next";
import PseudoFooter from "./PseudoFooter";
import styles from "scss/components/login.module.scss";

interface Props {
  unexpectedError: boolean
  step: number
}

const Footer = (props: Props) => {
  const { t } = useTranslation();

  if (props.unexpectedError) {
    return (
      <div className={styles.error_message}>
        {t(
          "Login.Une erreur est survenue. Veuillez réessayer.",
          "Une erreur est survenue. Veuillez réessayer."
        )}
      </div>
    )
  }

  if (props.step === 0) {
    return <PseudoFooter />
  }

  return null
};

export default Footer;
