import React from "react";
import { Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem, Row, Col, Progress } from "reactstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import { useTranslation } from "next-i18next";
import { Language } from "types/interface";
import FButton from "components/UI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { Event } from "lib/tracking";
import { activatedLanguages } from "data/activatedLanguages";
import styles from "./LanguageModal.module.scss";
import { getPath } from "routes";

interface Props {
  show: boolean;
  toggle: () => void;
  currentLanguage: string;
  changeLanguage: (ln: string) => void;
  isLanguagesLoading: boolean;
  languages: Language[];
}

const LanguageModal = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const getAvancementTrad = (i18nCode: string) => {
    if (i18nCode === "fr") return 1;
    const language = props.languages.find((ln) => ln.i18nCode === i18nCode);
    return language?.avancementTrad ? Math.min(language.avancementTrad, 1) : 0;
  };

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <ModalHeader toggle={props.toggle} className={styles.modal_header}>
        <span className={styles.title}>
          {!isMobile && t("Homepage.Choisir une langue", "Choisir une langue")}
          {isMobile && t("Homepage.Ma langue", "Ma langue")}
        </span>
        {!isMobile && (
          <div className={styles.subtitle}>
            {t("Homepage.site dispo", "Réfugiés.info est disponible dans les langues suivantes :")}
          </div>
        )}
      </ModalHeader>
      <ModalBody className={styles.modal_body}>
        <ListGroup>
          {activatedLanguages.map((ln) => {
            const isSelected = ln.i18nCode === props.currentLanguage;
            return (
              <ListGroupItem
                action
                key={ln.i18nCode}
                onClick={() => {
                  Event("CHANGE_LANGUAGE", ln.i18nCode, "label");
                  props.changeLanguage(ln.i18nCode);
                }}
                className={styles.list_group_item + "  " + (isSelected && styles.active)}
              >
                <Row>
                  <Col xs="1">
                    <i className={`flag-icon flag-icon-${ln.langueCode}`} title={ln.langueCode} id={ln.langueCode}></i>
                  </Col>
                  <Col xs="5" className={styles.ln_col}>
                    <span>
                      <b>{ln.langueFr}</b> - {ln.langueLoc}
                    </span>
                  </Col>
                  {!isMobile && (
                    <Col xs="5" className={styles.progress_col}>
                      {props.isLanguagesLoading === false && (
                        <>
                          <Progress
                            color={isSelected ? "light-green" : "primary"}
                            value={getAvancementTrad(ln.i18nCode) * 100}
                            className={styles.progress}
                          />
                          <span className={isSelected ? "text-light-green" : "text-primary"}>
                            <b>{Math.round(getAvancementTrad(ln.i18nCode) * 100) + " %"}</b>
                          </span>
                        </>
                      )}
                    </Col>
                  )}
                  <Col xs="1" className={styles.icon_col}>
                    {isSelected && <EVAIcon name="checkmark-circle-2" fill="#FFFFFF" size="large" />}
                  </Col>
                </Row>
              </ListGroupItem>
            );
          })}

          {!isMobile && (
            <ListGroupItem action key="unavailable" className={styles.list_group_item + " " + styles.unavailable}>
              <Row>
                <Col xs="8" className={styles.vertical_center}>
                  <b>{t("Homepage.traduire", "Aidez-nous à traduire !")}</b>
                </Col>
                <Col xs="4" className={styles.button_col}>
                  <Link href={getPath("/traduire", router.locale)} passHref>
                    <FButton tag="a" onClick={props.toggle} type="outline">
                      {t("Homepage.btn_translate", "Je traduis")}
                    </FButton>
                  </Link>
                </Col>
              </Row>
            </ListGroupItem>
          )}
        </ListGroup>
      </ModalBody>
    </Modal>
  );
};

export default LanguageModal;
