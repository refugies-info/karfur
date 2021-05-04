import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";
import Swal from "sweetalert2";
import styled from "styled-components";
import API from "../../utils/API";
import { isMobile } from "react-device-detect";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: ${isMobile ? "wrap" : "no-wrap"};
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: ${isMobile ? "wrap" : "no-wrap"};
`;

const TextContainer = styled.div`
  display: flex;
  width: ${isMobile ? "" : "400px"};
  margin-right: 20px;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  margin-left: 20x;
  padding: 0 10px;
  margin-top: ${isMobile ? "25px" : ""};
  font-size: ${isMobile ? "18px" : "16px"};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${isMobile ? "" : "40px"};
  margin-top: ${isMobile ? "30px" : ""};
`;

import "./Footer.scss";
import { colors } from "colors";
import FButton from "../../components/FigmaUI/FButton/FButton";

export class Footer extends Component {
  state = {
    email: "",
  };

  onChange = (e) => this.setState({ email: e.target.value });

  sendMail = (e) => {
    e.preventDefault();
    if (!this.state.email) {
      Swal.fire({
        title: "Oops...",
        text: "Aucun mail renseigné",
        type: "error",
        timer: 1500,
      });
      return;
    }
    API.set_mail({ mail: this.state.email })
      .then(() => {
        Swal.fire({
          title: "Yay...",
          text: "Mail correctement enregistré !",
          type: "success",
          timer: 1500,
        });
        this.setState({ email: "" });
      })
      .catch(() =>
        Swal.fire("Oh non...", "Une erreur s'est produite", "error")
      );
  };

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
                {
                  "Réfugiés.info est un portail d’information collaboratif porté par la "
                }
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
                {" et développé par la "}
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
                <div className="lien-footer">
                  <NavHashLink to="/comment-contribuer">
                    {t(
                      "CommentContribuer.Participer / Contribuer",
                      "Participer / Contribuer"
                    )}
                  </NavHashLink>
                </div>
              )}
              <div className="lien-footer">
                <NavLink to="/advanced-search">
                  {t(
                    "Dispositif d'accompagnement",
                    "Chercher de l'information"
                  )}
                </NavLink>
              </div>
              {!isMobile && (
                <div className="lien-footer">
                  <NavLink to="/annuaire">
                    {t(
                      "Homepage.Consulter l’annnuaire",
                      "Consulter l'annuaire"
                    )}
                  </NavLink>
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
                <div className="lien-footer">
                  <NavHashLink to="/qui-sommes-nous">
                    {t("Qui sommes-nous ?", "Qui sommes-nous ?")}
                  </NavHashLink>
                </div>
              )}
              <div className="lien-footer">
                <a onClick={() => window.$crisp.push(["do", "chat:open"])}>
                  {t("Démarche administrative", "Contacter l'èquipe")}
                </a>
              </div>
              <div className="lien-footer">
                <NavLink to="/politique-de-confidentialite">
                  {t(
                    "Politique de confidentialité",
                    "Politique de confidentialité"
                  )}
                </NavLink>
              </div>
              <div className="lien-footer">
                <NavLink to="/mentions-legales">
                  {t("Mentions légales", "Mentions légales")}
                </NavLink>
              </div>
            </LinkContainer>
          </ColumnContainer>
          <ButtonContainer>
            <div className="position-relative">
              <FButton
                tag={"a"}
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn"
                type="light-action"
                name="email-outline"
                fill={colors.noir}
              >
                {t(
                  "Footer.Je m'abonne à la newsletter",
                  "S'inscrire à la lettre d'information"
                )}
              </FButton>
            </div>
            <div className="ligne-footer">
              <FButton
                tag={"a"}
                href="https://refugies.canny.io/"
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
                type="help"
                name="question-mark-circle-outline"
                fill={colors.noir}
              >
                {t("Footer.Centre d'aide", "Consulter le centre d'aide")}
              </FButton>
            </div>
          </ButtonContainer>
        </MainContainer>
      </div>
    );
  }
}

export default withTranslation()(Footer);
