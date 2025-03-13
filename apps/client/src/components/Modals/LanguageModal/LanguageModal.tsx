import { Button } from "@codegouvfr/react-dsfr/Button";
import { GetLanguagesResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import { Col, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { getPath } from "routes";
import { LanguageSelector } from "~/components/UI/LanguageSelector";
import styles from "./LanguageModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  currentLanguage: string;
  changeLanguage: (ln: string) => void;
  isLanguagesLoading: boolean;
  languages: GetLanguagesResponse[];
}

const LanguageModal = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <ModalHeader toggle={props.toggle} className={styles.modal_header}>
        <>
          <span className={styles.title}>
            {!isMobile && t("Homepage.Choisir une langue", "Choisir une langue")}
            {isMobile && t("Homepage.Ma langue", "Ma langue")}
          </span>
          {!isMobile && (
            <div className={styles.subtitle}>
              {t("Homepage.site dispo", "Réfugiés.info est disponible dans les langues suivantes :")}
            </div>
          )}
        </>
      </ModalHeader>
      <ModalBody className={styles.modal_body}>
        <ListGroup>
          <LanguageSelector onChangeLang={props.toggle} />

          {!isMobile && (
            <ListGroupItem action key="unavailable" className={styles.list_group_item + " " + styles.unavailable}>
              <Row>
                <Col xs="8" className={styles.vertical_center}>
                  <b>{t("Homepage.traduire", "Aidez-nous à traduire !")}</b>
                </Col>
                <Col xs="4" className={styles.button_col}>
                  <Button
                    onClick={() => {
                      props.toggle();
                      setTimeout(() => {
                        router.push({
                          pathname: getPath("/traduire", router.locale),
                        });
                      }, 100);
                    }}
                  >
                    {t("Homepage.btn_translate", "Je traduis")}
                  </Button>
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
