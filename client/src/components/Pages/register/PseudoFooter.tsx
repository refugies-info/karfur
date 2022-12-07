import React from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import styles from "./PseudoFooter.module.scss";
import { getPath } from "routes";
import { useRouter } from "next/router";

const PseudoFooter = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className={styles.container}>
      {t("Register.Déjà un compte ?", "Déjà un compte ?")}
      <Link legacyBehavior href={getPath("/login", router.locale)}>
        <a
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            marginLeft: "5px"
          }}
        >
          {t("Register.Se connecter", "Se connecter")}
        </a>
      </Link>
    </div>
  );
};

export default PseudoFooter;
