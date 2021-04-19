import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Progress,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { colorAvancement } from "../../Functions/ColorFunctions";
import { NavHashLink } from "react-router-hash-link";
import "./LanguageModal.scss";
import FButton from "../../FigmaUI/FButton/FButton";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";
import { Event, initGA } from "../../../tracking/dispatch";
import { activatedLanguages } from "./data";
import { isMobile } from "react-device-detect";

const languageModal = (props) => {
  const languages = {
    ...activatedLanguages,
    unavailable: { unavailable: true },
  };

  const getAvancement = (langue) => {
    if (langue.length === 0 || !langue[0].avancementTrad) return 0;

    if (langue[0].avancementTrad > 1) return 1;
    return langue[0].avancementTrad;
  };

  const getAvancementTrad = (element) => {
    if (languages[element].i18nCode === "fr") return 1;
    const correspondingLangue = props.langues.filter(
      (langue) => langue.i18nCode === languages[element].i18nCode
    );

    return getAvancement(correspondingLangue);
  };

  const { t } = props;
  if (props.show) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className="language-modal"
      >
        <ModalHeader toggle={props.toggle}>
          <span className="title">
            {!isMobile &&
              t("Homepage.Choisir une langue", "Choisir une langue")}
            {isMobile && t("Homepage.Ma langue", "Ma langue")}
          </span>
          {!isMobile && (
            <div className="sous-titre">
              {t(
                "Homepage.site dispo",
                "Réfugiés.info est disponible dans les langues suivantes :"
              )}
            </div>
          )}
        </ModalHeader>
        <ModalBody>
          <ListGroup>
            {Object.keys(languages).map((element) => {
              if (element === "unavailable" && !isMobile) {
                return (
                  <ListGroupItem
                    action
                    key={element}
                    className="unavailable-item"
                  >
                    <Row>
                      <Col
                        xl="8"
                        lg="8"
                        md="8"
                        sm="8"
                        xs="8"
                        className="vertical-center"
                      >
                        <b>
                          {t("Homepage.traduire", "Aidez-nous à traduire !")}
                        </b>
                      </Col>
                      <Col
                        xl="4"
                        lg="4"
                        md="4"
                        sm="4"
                        xs="4"
                        className="button-col"
                      >
                        <FButton
                          tag={NavHashLink}
                          to="/comment-contribuer#traduire"
                          onClick={props.toggle}
                          type="outline"
                        >
                          {t("Homepage.Je traduis", "Je traduis")}
                        </FButton>
                      </Col>
                    </Row>
                  </ListGroupItem>
                );
              } else if (element !== "unavailable") {
                const isSelected =
                  languages[element].i18nCode === props.current_language;
                return (
                  <ListGroupItem
                    action
                    key={languages[element]._id}
                    disabled={!languages[element].avancement}
                    onClick={() => {
                      initGA();
                      Event(
                        "CHANGE_LANGUAGE",
                        languages[element].i18nCode,
                        "label"
                      );
                      props.changeLanguage(languages[element].i18nCode);
                    }}
                    className={isSelected ? "active" : ""}
                  >
                    <Row>
                      <Col xl="1" lg="1" md="1" sm="1" xs="1">
                        <i
                          className={
                            "flag-icon flag-icon-" +
                            languages[element].langueCode
                          }
                          title={languages[element].langueCode}
                          id={languages[element].langueCode}
                        ></i>
                      </Col>
                      <Col
                        xl="5"
                        lg="5"
                        md="5"
                        sm="5"
                        xs="5"
                        className="language-name"
                      >
                        <span>
                          <b>{languages[element].langueFr}</b> -{" "}
                          {languages[element].langueLoc}
                        </span>
                      </Col>
                      {!isMobile && (
                        <Col
                          xl="5"
                          lg="5"
                          md="5"
                          sm="5"
                          xs="5"
                          className="progress-col"
                        >
                          {props.isLanguagesLoading === false && (
                            <>
                              <Progress
                                color={colorAvancement(
                                  getAvancementTrad(element)
                                )}
                                value={getAvancementTrad(element) * 100}
                              />
                              <span
                                className={
                                  "text-" +
                                  colorAvancement(getAvancementTrad(element))
                                }
                              >
                                <b>
                                  {Math.round(
                                    getAvancementTrad(element) * 100 || 0,
                                    0
                                  ) + " %"}
                                </b>
                              </span>
                            </>
                          )}
                        </Col>
                      )}
                      <Col
                        xl="1"
                        lg="1"
                        md="1"
                        sm="1"
                        xs="1"
                        className="icon-col"
                      >
                        {isSelected && (
                          <EVAIcon
                            name="checkmark-circle-2"
                            fill="#FFFFFF"
                            size="large"
                          />
                        )}
                      </Col>
                    </Row>
                  </ListGroupItem>
                );
              }
            })}
          </ListGroup>
        </ModalBody>
      </Modal>
    );
  }
  return false;
};

export default withTranslation()(languageModal);
