import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";
import { Row, Col, Form, FormGroup } from "reactstrap";
import Swal from "sweetalert2";

import API from "../../utils/API";

import "./Footer.scss";
import { colors } from "colors";
//import EVAIcon from "../../components/UI/EVAIcon/EVAIcon";
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
        <Row className="negative-margin">
          <Col xl="8" lg="8" md="8" sm="12" xs="12" className="right-col mt-10">
            <Row className="main-row negative-margin">
              <Col xl="4" lg="4" md="4" sm="4" xs="12" className="mt-10">
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
              </Col>
              <Col xl="4" lg="4" md="4" sm="4" xs="12" className="mt-10">
                <div className="lien-footer">
                  <NavHashLink to="/comment-contribuer">
                    {t(
                      "CommentContribuer.Participer / Contribuer",
                      "Participer / Contribuer"
                    )}
                  </NavHashLink>
                </div>
                <div className="lien-footer">
                  <NavLink to="/advanced-search">
                    {t(
                      "Dispositif d'accompagnement",
                      "Chercher de l'information"
                    )}
                  </NavLink>
                </div>
                <div className="lien-footer">
                  <NavLink to="/annuaire">
                    {t(
                      "Homepage.Consulter l’annnuaire",
                      "Consulter l'annuaire"
                    )}
                  </NavLink>
                </div>
                <div className="lien-footer">
                  <a href="https://avec.refugies.info/">
                    {t(
                      "QuiSommesNous.réseau",
                      "Rejoindre le réseau des contributeurs"
                    )}
                  </a>
                </div>
              </Col>
              <Col xl="4" lg="4" md="4" sm="4" xs="12" className="mt-10">
                <div className="lien-footer">
                  <NavHashLink to="/qui-sommes-nous">
                    {t("Qui sommes-nous ?", "Qui sommes-nous ?")}
                  </NavHashLink>
                </div>
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
              </Col>
            </Row>
          </Col>
          <Col xl="4" lg="4" md="4" sm="12" xs="12" className="mt-10">
            <Form onSubmit={this.sendMail}>
              <FormGroup>
                {/*<Label for="emailNewsletter">Rejoindre la newsletter</Label>*/}
                <div className="position-relative">
                  {/* <Input
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    id="emailNewsletter"
                    placeholder={t(
                      "Footer.Je m'abonne à la newsletter",
                      "S'inscrire à la lettre d'information"
                    )}
                  />
                  <InputGroupAddon
                    addonType="append"
                    className="icon-append"
                    onClick={this.sendMail}
                  >
                    <EVAIcon name="paper-plane-outline" fill={colors.noir} />
                  </InputGroupAddon> */}
                  <FButton
                    tag={"a"}
                    href="https://refugies-info.mn.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-btn"
                    type="light-action"
                    name="email"
                    fill={colors.noir}
                  >
                    {t(
                      "Footer.Je m'abonne à la newsletter",
                      "S'inscrire à la lettre d'information"
                    )}
                  </FButton>
                </div>
              </FormGroup>
            </Form>
            <div className="ligne-footer">
              {/*<label>Rejoindre la newsletter</label>*/}
              {/* <FButton
                tag={"a"}
                href="https://refugies-info.mn.co"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn"
                type="light-action"
                name="people-outline"
                fill={colors.noir}
              >
                {t(
                  "Footer.Participer à l'évolution de réfugiés-info",
                  "Participer à l'évolution de réfugiés.info"
                )}
              </FButton> */}
            </div>
            <div className="ligne-footer">
              {/*<label>Demander de nouveaux contenus</label>*/}
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
              {/*<label>Demander de nouveaux contenus</label>*/}
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
          </Col>
        </Row>
      </div>
    );
  }
}

export default withTranslation()(Footer);
