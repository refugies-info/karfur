import React from "react";
import { Col, Row } from "reactstrap";
import { NavLink } from "react-router-dom";
import moment from "moment/min/moment-with-locales";
import { withTranslation } from "react-i18next";
import { NavHashLink } from "react-router-hash-link";

import FButton from "../../../FigmaUI/FButton/FButton";

import "./DashHeader.scss";
import { NoSponsorImage } from "../../../NoSponsorImage/NoSponsorImage";

moment.locale("fr");

const dashHeader = (props) => {
  const roles =
    (
      ((props.structure || {}).membres || []).find(
        (x) => x.userId === props.user._id
      ) || {}
    ).roles || [];
  let role = roles.includes("administrateur")
    ? "responsable"
    : roles.includes("createur")
    ? "créateur"
    : roles.includes("contributeur")
    ? "contributeur"
    : "membre";

  const IndicateursBloc = (props) => {
    if (props.isStructure) {
      const structure = props.structure || {};
      const nbTraducteurs = [
        ...new Set(
          (props.traductions || [])
            .reduce((acc, curr) => [...acc, curr.userId, curr.validatorId], [])
            .filter((x) => x)
        ),
      ].length;
      return (
        <Row className="header-structure">
          <Col xl="6" lg="6" md="12" sm="12" xs="12" className="mt-10">
            <Row className="titre-structure">
              <Col lg="6" md="6" sm="6" xs="6" className="img-wrapper-col">
                <div className="img-wrapper">
                  {structure.picture && structure.picture.secure_url ? (
                    <img
                      src={structure.picture.secure_url}
                      className="logo-img"
                      alt="logo-img"
                    />
                  ) : (
                    <NoSponsorImage
                      acronyme={structure.acronyme}
                      nom={structure.nom}
                      alt={structure.alt}
                    />
                  )}
                </div>
              </Col>
              <Col lg="6" md="6" sm="6" xs="6" className="right-side">
                <h5>{structure.nom}</h5>
                <b className="role">Vous êtes {role}</b>
              </Col>
            </Row>
          </Col>
          <Col
            xl="6"
            lg="6"
            md="12"
            sm="12"
            xs="12"
            className="right-side-header"
          >
            <Row className="row-indicateurs">
              <Col lg="4" className="struct-indicateurs">
                <div className="indicateur">
                  <h2>{(structure.dispositifsAssocies || []).length}</h2>
                  <div>
                    contenu
                    {(structure.dispositifsAssocies || []).length > 1
                      ? "s"
                      : ""}{" "}
                    publié
                    {(structure.dispositifsAssocies || []).length > 1
                      ? "s"
                      : ""}{" "}
                  </div>
                </div>
              </Col>
              <Col lg="4" className="struct-indicateurs">
                <div className="indicateur">
                  <h2>{nbTraducteurs}</h2>
                  <div>
                    traducteur{nbTraducteurs > 1 ? "s" : ""} mobilisé
                    {nbTraducteurs > 1 ? "s" : ""}
                  </div>
                </div>
              </Col>
              <Col lg="4" className="struct-indicateurs">
                <div className="indicateur">
                  <h2>{(structure.membres || []).length}</h2>
                  <div>
                    membre{(structure.membres || []).length > 1 ? "s" : ""}
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="row-indicateurs">
              <Col lg="4" className="struct-indicateurs">
                <div className="indicateur">
                  <h2>{props.actions.length}</h2>
                  <div>notification{props.actions.length > 1 ? "s" : ""}</div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }
    return (
      <Row className="header-indicateurs">
        <Col lg="4" md="12" sm="12" xs="12">
          <div className="inner-indicator second-indicator">
            <h3 className="right-side">
              {props.motsRediges || 0}{" "}
              <span className="gris">/ {props.objectifMots || 0}</span>
            </h3>
            <div className="left-side">
              <b className="mot-indicateur">mots</b> traduits pour atteindre
              votre objectif. <i>Courage !</i>
            </div>
          </div>
        </Col>
        <Col lg="4" md="12" sm="12" xs="12">
          <div className="inner-indicator third-indicator">
            <h3 className="right-side">
              {props.minutesPassees || 0}{" "}
              <span className="gris">/ {props.objectifTemps || 0}</span>
            </h3>
            <div className="left-side">
              <b className="mot-indicateur">minutes</b> dédiés à l'accueil des
              personnes réfugiés. <br />
              <i>Merci !</i>
            </div>
          </div>
        </Col>
      </Row>
    );
  };
  return (
    <div className="dash-header">
      <Row>
        <Col>
          <h2 className="ariane">
            <NavLink to="/backend/user-profile" className="my-breadcrumb">
              Mon profil
            </NavLink>{" "}
            / {props.title}
          </h2>
        </Col>
        <Col className="tableau-header align-right">
          <FButton
            tag={"a"}
            href="https://help.refugies.info/fr/"
            target="_blank"
            rel="noopener noreferrer"
            type="help"
            name="info-outline"
            className="mr-10"
          >
            Aide
          </FButton>
          {props.ctaText && (
            <FButton
              type="dark"
              name="options-2-outline"
              onClick={() => props.toggle("objectifs")}
            >
              {props.ctaText}
            </FButton>
          )}
          {props.contributeur && (
            <FButton
              tag={NavHashLink}
              to="/comment-contribuer#ecrire"
              type="dark"
              name="plus-circle-outline"
              className="ml-10"
            >
              Créer un contenu
            </FButton>
          )}
          {props.traducteur && (
            <FButton
              type="dark"
              name="done-all-outline"
              className="ml-10"
              onClick={() => props.toggle("defineUser")}
            >
              Modifier mes langues
            </FButton>
          )}
        </Col>
      </Row>
      {(props.title === "Mes traductions" ||
        props.title === "Votre structure") && <IndicateursBloc {...props} />}
    </div>
  );
};

export default withTranslation()(dashHeader);
