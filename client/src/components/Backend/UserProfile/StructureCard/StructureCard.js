import React, { Component } from "react";
import {
  Col,
  Row,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import moment from "moment/min/moment-with-locales";
import { NavLink as DefaultNavLink } from "react-router-dom";
import { withTranslation } from "react-i18next";
import windowSize from "react-window-size";

import FButton from "../../../FigmaUI/FButton/FButton";
import { diairMinInt, countrySide } from "../../../../assets/figma";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import { breakpoints } from "utils/breakpoints.js";

import "./StructureCard.scss";
import variables from "scss/colors.scss";

moment.locale("fr");

const jsUcfirst = (string) => {
  return (
    string &&
    string.length > 1 &&
    string.charAt(0).toUpperCase() + string.slice(1, string.length - 1)
  );
};

class StructureCard extends Component {
  state = {
    activeTab: 0,
  };

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  render() {
    const {
      t,
      actions,
      title,
      structure,
      nbRead,
      windowWidth,
      traductions,
    } = this.props;
    const actionTypes = [
      ...new Set((actions || []).map((x) => x.action)),
    ].map((a) => ({
      type: a,
      actions: (actions || []).filter((y) => y.action === a) || [],
    }));
    const nbTraducteurs = [
      ...new Set(
        (traductions || [])
          .reduce((acc, curr) => [...acc, curr.userId, curr.validatorId], [])
          .filter((x) => x)
      ),
    ].length;
    const sommeDates = (structure.dispositifsAssocies || [])
      .map((x) => x.updatedAt)
      .reduce((acc, curr) => (acc += moment(curr)), 0);
    const moyenneDate =
      sommeDates / (structure.dispositifsAssocies || []).length;
    return (
      <div className="tableau-wrapper structure-card" id="structure">
        <Row>
          <Col xl="6" lg="6" md="12" sm="12" xs="12">
            <h1>{t("Tables." + title, title)}</h1>
          </Col>
          {this.props.displayIndicators && (
            <Col
              xl="6"
              lg="6"
              md="12"
              sm="12"
              xs="12"
              className="d-flex tableau-header justify-content-end"
            >
              {windowWidth >= breakpoints.phoneDown &&
                (
                  (
                    (structure.membres || []).find(
                      (x) => x.userId === this.props.user._id
                    ) || {}
                  ).roles || []
                ).some(
                  (y) => y === "administrateur" || y === "contributeur"
                ) && (
                  <FButton
                    type="dark"
                    name="options-2-outline"
                    className="mr-10"
                    onClick={() => this.props.toggleModal("addMember")}
                  >
                    {t("Tables.Ajouter un membre", "Ajouter un membre")}
                  </FButton>
                )}
              <FButton
                tag={DefaultNavLink}
                to="/backend/user-dash-structure"
                type="dark"
                name="settings-2-outline"
              >
                {t("Tables.Espace structure", "Espace structure")}
              </FButton>
            </Col>
          )}
        </Row>

        <Card className="main-card">
          <CardBody>
            <DefaultNavLink
              to="/backend/user-dash-structure"
              className="one-third right-padding"
            >
              <div className="left-side">
                <div className="logo-bloc">
                  <div className="img-wrapper">
                    <img
                      src={(structure.picture || {}).secure_url || diairMinInt}
                      className="logo-img"
                      alt="logo de la structure"
                    />
                  </div>
                  <div className="logo-footer">
                    <b>{structure.nom}</b>
                  </div>
                </div>
              </div>
            </DefaultNavLink>
            <div
              className={
                "one-third middle-side" +
                (actions && actions.length > 0 ? "" : " no-results-wrapper")
              }
            >
              {actions && actions.length > 0 ? (
                <>
                  <Nav tabs>
                    {actionTypes.map((type, i) => (
                      <NavItem key={i}>
                        <NavLink
                          className={this.state.activeTab === i ? "active" : ""}
                          onClick={() => this.toggle(i)}
                        >
                          {windowWidth >= breakpoints.widescreenUp ? (
                            <span>
                              {jsUcfirst(t("Tables." + type.type, type.type))}
                            </span>
                          ) : (
                            <EVAIcon
                              name={
                                (type.type === "suggestion"
                                  ? "file-text"
                                  : "question-mark-circle") + "-outline"
                              }
                              fill={variables.noir}
                            />
                          )}
                          <span className="float-right">
                            {type.actions.length}
                          </span>
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    {actionTypes.map((type, i) => (
                      <TabPane tabId={i} key={i}>
                        <ListGroup className="liste-actions">
                          {type.actions.map((act, key) => {
                            const joursDepuis =
                              (new Date().getTime() -
                                new Date(act.depuis).getTime()) /
                              (1000 * 3600 * 24);
                            return (
                              <ListGroupItem
                                key={act.suggestionId || key}
                                className={
                                  "depuis text-ellipsis " +
                                  (joursDepuis > 10
                                    ? "alert"
                                    : joursDepuis > 3
                                    ? "warning"
                                    : "")
                                }
                              >
                                <span>{act.texte}</span>
                                <span className="float-right">
                                  {moment(act.depuis).fromNow()}
                                </span>
                              </ListGroupItem>
                            );
                          })}
                        </ListGroup>
                      </TabPane>
                    ))}
                  </TabContent>
                </>
              ) : (
                <div className="no-results">
                  <img src={countrySide} alt="illustration protection" />
                  <h5 className="mt-12">
                    {t(
                      "Tables.futures notifs",
                      "Ici apparaîtront les notifications relatives à votre structure"
                    )}
                    ...
                  </h5>
                </div>
              )}
            </div>
            <div className="one-third right-side">
              <Row>
                <Col lg="6">
                  <div className="indicateur">
                    <h2>{(structure.dispositifsAssocies || []).length}</h2>
                    <div>
                      {t("Tables.contenu", "contenu{{s}}", {
                        s:
                          (structure.dispositifsAssocies || []).length > 1
                            ? "s"
                            : "",
                      })}
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="indicateur">
                    <h2>{nbTraducteurs}</h2>
                    <div>
                      {t(
                        "Tables.traducteur mobilisé",
                        "traducteur{{s}} mobilisé{{s}}",
                        { s: nbTraducteurs > 1 ? "s" : "" }
                      )}
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="indicateur">
                    <h2>{(structure.membres || []).length}</h2>
                    <div>
                      {t("Tables.membre", "membre{{s}}", {
                        s: (structure.membres || []).length > 1 ? "s" : "",
                      })}
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="indicateur">
                    <h2>{actions.length}</h2>
                    <div>
                      {t("Tables.notification", "notification{{s}}", {
                        s: actions.length > 1 ? "s" : "",
                      })}
                    </div>
                  </div>
                </Col>
                <Col lg="6">
                  <div className="indicateur">
                    <h2>{nbRead}</h2>
                    <div>
                      {t(
                        "Tables.personne informée",
                        "personne{{s}} informée{{s}}",
                        { s: nbRead > 1 ? "s" : "" }
                      )}
                    </div>
                  </div>
                </Col>
                {moyenneDate && (
                  <Col lg="6">
                    <div className="indicateur">
                      <h4>{moment(moyenneDate).fromNow()}</h4>
                      <div>moyenne des dernières intéractions</div>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default withTranslation()(windowSize(StructureCard));
