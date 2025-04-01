import { useTranslation } from "next-i18next";
import Link from "next/link";
import { getPath } from "routes";
import { HelpNotice } from "~/components/Pages/recherche/HelpNotice";
import SEO from "~/components/Seo";
import { useLocale } from "~/hooks";
import { defaultStaticProps } from "~/lib/getDefaultStaticProps";
import { Event } from "~/lib/tracking";
import styles from "~/scss/pages/legal-pages.module.scss";

const PlanDuSite = () => {
  const locale = useLocale();
  const { t } = useTranslation();
  return (
    <div className="flex w-full flex-col justify-center">
      <HelpNotice />
      <div className={styles.legal_pages + " animated fadeIn texte-small"}>
        <SEO title="Plan du site" />
        <h1>Plan du site</h1>
        <ul>
          <li>
            <Link href={getPath("/", locale)}>Accueil</Link>
          </li>
          <li>
            <Link href={getPath("/recherche", locale)} prefetch={false}>
              {t("Toolbar.find_information", "Trouver de l'information")}
            </Link>
          </li>
          <li>
            <Link href={getPath("/publier", locale)} prefetch={false}>
              {t("Toolbar.Publier une fiche", "Publier une fiche")}
            </Link>
          </li>
          <li>
            <Link href={getPath("/traduire", locale)} prefetch={false}>
              {t("Toolbar.Traduire", "Traduire")}
            </Link>
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
                  {t("Toolbar.posters_leaflets", "Affiches et dépliants")}
                </a>
              </li>
              <li>
                <a href="https://kit.refugies.info/presse/" target="_blank">
                  {t("Toolbar.Pour la presse", "Pour la presse")}
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="https://parrainage.refugies.info/" target="_blank">
              {t("Toolbar.for_ukraine", "Pour l'Ukraine")}
            </a>
          </li>
          <li>
            <Link href="/#application">{t("MobileAppModal.download")}</Link>
          </li>
          <li>
            <Link href={getPath("/auth", "fr")} prefetch={false} onClick={() => Event("AUTH", "start", "footer")}>
              {t("Toolbar.Inscription", "Inscription")}
            </Link>
          </li>
          <li>
            <Link href={getPath("/auth", "fr")} prefetch={false} onClick={() => Event("AUTH", "start", "footer")}>
              {t("Toolbar.Connexion", "Connexion")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;

export default PlanDuSite;
