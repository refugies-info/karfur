import React from "react";
import { useTranslation } from "react-i18next";
import FButton from "components/FigmaUI/FButton/FButton";
import Link from "next/link";
import {colors} from "colors";
import styles from "./UnauthorizedAccess.module.scss";


const UnauthorizedAccess = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h3>{t("UnauthorizedAccess.Accès refusé", "Accès refusé")}</h3>
      <Link href="/" passHref>
        <FButton
          tag="a"
          fill={colors.noir}
          name="arrow-back-outline"
          tabindex="1"
        >
          {t("UnauthorizedAccess.Revenir à l'accueil", "Revenir à l'accueil")}
        </FButton>
      </Link>
    </div>
  )
}

export default UnauthorizedAccess;
