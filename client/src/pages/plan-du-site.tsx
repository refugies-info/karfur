import React from "react";
import Link from "next/link";
import styles from "scss/pages/legal-pages.module.scss";
import SEO from "components/Seo";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { getPath } from "routes";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const PlanDuSite = () => {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <div className={styles.legal_pages + " animated fadeIn texte-small"}>
      <SEO title="Plan du site" />
      <h1>Plan du site</h1>
      <ul>
        <li>
          <Link href={getPath("/", router.locale)}>Accueil</Link>
        </li>
        <li>
          <Link href={getPath("/recherche", router.locale)}>
            {t("Toolbar.Trouver de l'information", "Trouver de l'information")}
          </Link>
        </li>
        <li>
          <Link href={`${getPath("/publier", router.locale)}`}>
            {t("Toolbar.Publier une fiche", "Publier une fiche")}
          </Link>
        </li>
        <li>
          <Link href={`${getPath("/traduire", router.locale)}`}>{t("Toolbar.Traduire", "Traduire")}</Link>
        </li>
        <li>
          {t("Toolbar.Parler de nous", "Parler de nous")}
          <ul>
            <li>
              <a href="https://kit.refugies.info/" target="_blank">
                {t("Toolbar.Kit de communication", "Kit de communication")}
              </a>
            </li>
            <li>
              <a href="https://kit.refugies.info/flyers/" target="_blank">
                {t("Toolbar.Affiches et dépliants", "Affiches et dépliants")}
              </a>
            </li>
            <li>
              <a href="https://kit.refugies.info/presse/" target="_blank">
                {t("Toolbar.Pour la presse", "Pour la presse")}
              </a>
            </li>
            <li>
              {" "}
              <a href="https://kit.refugies.info/ambassadeurs/" target="_blank">
                {t("Toolbar.Pour les ambassadeurs", "Pour les ambassadeurs")}
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="https://parrainage.refugies.info/" target="_blank">
            {t("Toolbar.Pour l'Ukraine", "Pour l'Ukraine")}
          </a>
        </li>
        <li>
          <Link href="/#application">{t("MobileAppModal.Télécharger l'application")}</Link>
        </li>
        <li>
          <Link href={getPath("/register", router.locale)}>{t("Toolbar.Inscription", "Inscription")}</Link>
        </li>
        <li>
          <Link href={getPath("/login", router.locale)}>{t("Toolbar.Connexion", "Connexion")}</Link>
        </li>
      </ul>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default PlanDuSite;
