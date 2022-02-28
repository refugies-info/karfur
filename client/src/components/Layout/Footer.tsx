import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { SubscribeNewsletterModal } from "components/Modals/SubscribeNewsletterModal/SubscribeNewsletterModal";
import { colors } from "colors";
import FButton from "components/FigmaUI/FButton/FButton";
import styles from "./Footer.module.scss";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: ${isMobile ? "wrap" : "no-wrap"};
  justify-content: center;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: ${isMobile ? "wrap" : "no-wrap"};
`;

const TextContainer = styled.div`
  display: flex;
  max-width: ${isMobile ? "" : "400px"};
  margin-right: 20px;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  margin-left: ${isMobile ? "0px" : "20px"};
  margin-top: ${isMobile ? "25px" : ""};
  font-size: ${isMobile ? "18px" : "16px"};
  white-space: ${isMobile ? "" : "nowrap"}; ;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${isMobile ? "" : "40px"};
  margin-top: ${isMobile ? "30px" : ""};
  width: ${isMobile ? "100%" : "auto"};
`;

const Footer = () => {
  const [showSubscribeNewsletterModal, setShowSubscribeNewsletterModal] =
    useState(false);
  const { t } = useTranslation();

  const toggleSubscribeNewsletterModal = () =>
    setShowSubscribeNewsletterModal(!showSubscribeNewsletterModal);

  return (
    <div className={styles.footer + " animated fadeIn"}>
      <MainContainer>
        <ColumnContainer>
          <TextContainer>
            <h5 className={styles.header}>
              {t(
                "Footer.description",
                "Réfugiés.info est un portail d’information collaboratif porté par la "
              )}
              <a
                style={{ textDecoration: "underline" }}
                target="_blank"
                href="https://accueil-integration-refugies.fr/"
                rel="noopener noreferrer"
              >
                {
                  "Délégation interministérielle à l’accueil et l’intégration des réfugiés"
                }
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
          </TextContainer>
          <LinkContainer>
            {!isMobile && (
              <Link href="/comment-contribuer">
                <a className={styles.link}>
                  {t(
                    "CommentContribuer.Participer / Contribuer",
                    "Participer / Contribuer"
                  )}
                </a>
              </Link>
            )}
            <Link href="/advanced-search">
              <a className={styles.link}>
                {t("Dispositif d'accompagnement", "Chercher de l'information")}
              </a>
            </Link>

            {!isMobile && (
              <Link href="/annuaire">
                <a className={styles.link}>
                  {t("Homepage.Consulter l’annnuaire", "Consulter l'annuaire")}
                </a>
              </Link>
            )}

            <a
              href="https://avec.refugies.info/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {t(
                "QuiSommesNous.réseau",
                "Rejoindre le réseau des contributeurs"
              )}
            </a>
          </LinkContainer>
          <LinkContainer>
            {!isMobile && (
              <Link href="/qui-sommes-nous">
                <a className={styles.link}>
                  {t("Qui sommes-nous ?", "Qui sommes-nous ?")}
                </a>
              </Link>
            )}
            <div className={styles.link}>
              <a
                onClick={() => { window.$crisp.push(["do", "chat:open"]) }}
              >
                {t("Démarche administrative", "Contacter l'èquipe")}
              </a>
            </div>
            <Link href="/politique-de-confidentialite">
              <a className={styles.link}>
                {t(
                  "Politique de confidentialité",
                  "Politique de confidentialité"
                )}
              </a>
            </Link>
            <Link href="/mentions-legales">
              <a className={styles.link}>
                {t("Mentions légales", "Mentions légales")}
              </a>
            </Link>
            <Link href="/declaration-accessibilite">
              <a className={styles.link}>
                {t("Footer.accessibility_link", "Accessibilité : non conforme")}
              </a>
            </Link>
          </LinkContainer>
        </ColumnContainer>
        <ButtonContainer>
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
              {t(
                "Footer.Je m'abonne à la newsletter",
                "S'inscrire à la newsletter"
              )}
            </FButton>
          </div>
          <div className={styles.space_btn}>
            <FButton
              onClick={() => { window.$crisp.push(["do", "chat:open"]) }}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btn}
              type="light-action"
              name="plus-circle-outline"
              fill={colors.gray90}
            >
              {t(
                "Footer.Demander des fonctionnalités",
                "Demander des fonctionnalités"
              )}
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
        </ButtonContainer>
      </MainContainer>
      <SubscribeNewsletterModal
        show={showSubscribeNewsletterModal}
        toggle={toggleSubscribeNewsletterModal}
      />
    </div>
  );
};

export default Footer;
