import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Swal from "sweetalert2";
import styled from "styled-components";

import { isMobile } from "react-device-detect";
import { SubscribeNewsletterModal } from "./SubscribeNewsletterModal/SubscribeNewsletterModal";
import { withRouter } from "react-router-dom";

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

import "./Footer.scss";
import { colors } from "colors";
import FButton from "../../components/FigmaUI/FButton/FButton";

export class Footer extends Component {
  state = {
    email: "",
    showSubscribeNewsletterModal: false,
  };

  onChange = (e) => this.setState({ email: e.target.value });

  toggleSubscribreNewsletterModal = () =>
    this.setState((prevState) => ({
      showSubscribeNewsletterModal: !prevState.showSubscribeNewsletterModal,
    }));

  upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore disponible",
      type: "error",
      timer: 1500,
    });

  render() {
    const { t } = this.props;
    return (
      <div className="animated fadeIn footer">
        <MainContainer>
          <ColumnContainer>
            <TextContainer>
              <h5 className="footer-header">
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
                <div
                  className="lien-footer"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    this.props.history.push("/comment-contribuer");
                  }}
                >
                  {t(
                    "CommentContribuer.Participer / Contribuer",
                    "Participer / Contribuer"
                  )}
                </div>
              )}
              <div
                className="lien-footer"
                onClick={() => {
                  window.scrollTo(0, 0);
                  this.props.history.push("/advanced-search");
                }}
              >
                {t("Dispositif d'accompagnement", "Chercher de l'information")}
              </div>
              {!isMobile && (
                <div
                  className="lien-footer"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    this.props.history.push("/annuaire");
                  }}
                >
                  {t("Homepage.Consulter l’annnuaire", "Consulter l'annuaire")}
                </div>
              )}
              <div className="lien-footer">
                <a
                  href="https://avec.refugies.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(
                    "QuiSommesNous.réseau",
                    "Rejoindre le réseau des contributeurs"
                  )}
                </a>
              </div>
            </LinkContainer>
            <LinkContainer>
              {!isMobile && (
                <div
                  className="lien-footer"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    this.props.history.push("/qui-sommes-nous");
                  }}
                >
                  {t("Qui sommes-nous ?", "Qui sommes-nous ?")}
                </div>
              )}
              <div className="lien-footer">
                <a onClick={() => window.$crisp.push(["do", "chat:open"])}>
                  {t("Démarche administrative", "Contacter l'èquipe")}
                </a>
              </div>
              <div
                className="lien-footer"
                onClick={() => {
                  window.scrollTo(0, 0);
                  this.props.history.push("/politique-de-confidentialite");
                }}
              >
                {t(
                  "Politique de confidentialité",
                  "Politique de confidentialité"
                )}
              </div>
              <div
                className="lien-footer"
                onClick={() => {
                  window.scrollTo(0, 0);
                  this.props.history.push("/mentions-legales");
                }}
              >
                {t("Mentions légales", "Mentions légales")}
              </div>
              <div
                className="lien-footer"
                onClick={() => {
                  this.props.history.push("/declaration-accessibilite");
                }}
              >
                {t("Footer.accessibility_link", "Accessibilité : non conforme")}
              </div>
            </LinkContainer>
          </ColumnContainer>
          <ButtonContainer>
            <div>
              <FButton
                onClick={() => this.toggleSubscribreNewsletterModal()}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn"
                type="light-action"
                name="email-outline"
                fill={colors.noir}
              >
                {t(
                  "Footer.Je m'abonne à la newsletter",
                  "S'inscrire à la newsletter"
                )}
              </FButton>
            </div>
            <div className="ligne-footer">
              <FButton
                onClick={() => window.$crisp.push(["do", "chat:open"])}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn"
                type="light-action"
                name="plus-circle-outline"
                fill={colors.noir}
              >
                {t(
                  "Footer.Demander des fonctionnalités",
                  "Demander des fonctionnalités"
                )}
              </FButton>
            </div>
            <div className="ligne-footer help">
              <FButton
                tag={"a"}
                href="https://help.refugies.info/fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn"
                type="tuto"
                name="question-mark-circle-outline"
                fill={colors.noir}
              >
                {t("Footer.Centre d'aide", "Consulter le centre d'aide")}
              </FButton>
            </div>
          </ButtonContainer>
        </MainContainer>
        <SubscribeNewsletterModal
          show={this.state.showSubscribeNewsletterModal}
          toggle={this.toggleSubscribreNewsletterModal}
          t={this.props.t}
        />
      </div>
    );
  }
}

export default withRouter(withTranslation()(Footer));
