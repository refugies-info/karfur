import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import { SubscribeNewsletterModal } from "components/Modals/SubscribeNewsletterModal/SubscribeNewsletterModal";
import { colors } from "colors";
import FButton from "components/UI/FButton/FButton";
import styles from "./Footer.module.scss";
import { getPath } from "routes";

const Footer = () => {
  const [showSubscribeNewsletterModal, setShowSubscribeNewsletterModal] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const toggleSubscribeNewsletterModal = () => setShowSubscribeNewsletterModal(!showSubscribeNewsletterModal);

  return (
    <div className={styles.footer + " animated fadeIn"}>
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.text}>
            <h5 className={styles.header}>
              {t("Footer.description", "Réfugiés.info est un portail d’information collaboratif porté par la ")}
              <a
                style={{ textDecoration: "underline" }}
                target="_blank"
                href="https://accueil-integration-refugies.fr/"
                rel="noopener noreferrer"
              >
                {"Délégation interministérielle à l’accueil et l’intégration des réfugiés"}
              </a>
              {t("Footer.description_suite", " et développé par la ")}
              <a
                style={{ textDecoration: "underline" }}
                target="_blank"
                href="https://lamednum.coop/"
                rel="noopener noreferrer"
              >
                {"Mednum"}
              </a>
            </h5>
          </div>
          <div className={styles.links}>
            {!isMobile && (
              <Link legacyBehavior href={getPath("/comment-contribuer", router.locale)}>
                <a className={styles.link}>
                  {t("CommentContribuer.Participer / Contribuer", "Participer / Contribuer")}
                </a>
              </Link>
            )}
            <Link legacyBehavior href={getPath("/recherche", router.locale)}>
              <a className={styles.link}>{t("Dispositif d'accompagnement", "Chercher de l'information")}</a>
            </Link>

            {!isMobile && (
              <Link legacyBehavior href={getPath("/annuaire", router.locale)}>
                <a className={styles.link}>{t("Homepage.Consulter l’annnuaire", "Consulter l'annuaire")}</a>
              </Link>
            )}

            <a href="https://avec.refugies.info/" target="_blank" rel="noopener noreferrer" className={styles.link}>
              {t("QuiSommesNous.réseau", "Rejoindre le réseau des contributeurs")}
            </a>
          </div>
          <div className={styles.links}>
            {!isMobile && (
              <Link legacyBehavior href={getPath("/qui-sommes-nous", router.locale)}>
                <a className={styles.link}>{t("Qui sommes-nous ?", "Qui sommes-nous ?")}</a>
              </Link>
            )}
            <div className={styles.link}>
              <a
                onClick={() => {
                  window.$crisp.push(["do", "chat:open"]);
                }}
              >
                {t("Démarche administrative", "Contacter l'èquipe")}
              </a>
            </div>
            <Link legacyBehavior href={getPath("/politique-de-confidentialite", router.locale)}>
              <a className={styles.link}>{t("Politique de confidentialité", "Politique de confidentialité")}</a>
            </Link>
            <Link legacyBehavior href={getPath("/mentions-legales", router.locale)}>
              <a className={styles.link}>{t("Mentions légales", "Mentions légales")}</a>
            </Link>
            <Link legacyBehavior href={getPath("/declaration-accessibilite", router.locale)}>
              <a className={styles.link}>{t("Footer.accessibility_link", "Accessibilité : non conforme")}</a>
            </Link>
          </div>
        </div>
        <div className={styles.buttons}>
          <div>
            <FButton
              onClick={() => toggleSubscribeNewsletterModal()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btn}
              type="light-action"
              name="email-outline"
              fill={colors.gray90}
            >
              {t("Footer.Je m'abonne à la newsletter", "S'inscrire à la newsletter")}
            </FButton>
          </div>
          <div className={styles.space_btn}>
            <FButton
              onClick={() => {
                window.$crisp.push(["do", "chat:open"]);
              }}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btn}
              type="light-action"
              name="plus-circle-outline"
              fill={colors.gray90}
            >
              {t("Footer.Demander des fonctionnalités", "Demander des fonctionnalités")}
            </FButton>
          </div>
          <div className={styles.space_btn}>
            <FButton
              tag={"a"}
              href="https://help.refugies.info/fr/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btn}
              type="tuto"
              name="question-mark-circle-outline"
              fill={colors.gray90}
            >
              {t("Footer.Centre d'aide", "Consulter le centre d'aide")}
            </FButton>
          </div>
        </div>
      </div>
      <SubscribeNewsletterModal show={showSubscribeNewsletterModal} toggle={toggleSubscribeNewsletterModal} />
    </div>
  );
};

export default Footer;
