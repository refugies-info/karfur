import { Button } from "@codegouvfr/react-dsfr/Button";
import type { GetLanguagesResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { isMobile } from "react-device-detect";
import { Col, ListGroup, ListGroupItem, Modal, ModalBody, Row } from "reactstrap";
import { getPath } from "routes";
import { LanguageSelector } from "~/components/UI/LanguageSelector";
import useLocale from "~/hooks/useLocale";
import { cn } from "~/lib/classname";
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
  const locale = useLocale();

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      labelledBy="language-modal-title"
      className={cn(styles.modal)}
      contentClassName={cn(styles.modal_content, "md:min-w-[37.5rem]")}
    >
      <ModalBody className={cn(styles.modal_body)}>
        <div className="flex flex-col gap-8">
          <Button
            onClick={props.toggle}
            className="!ms-auto translate-x-4 whitespace-nowrap"
            iconId="fr-icon-close-line"
            priority="tertiary no outline"
            iconPosition="right"
            size="small"
          >
            {t("close", "Fermer")}
          </Button>
          <h5 id="language-modal-title" className={cn(styles.title)}>
            {t("Homepage.modalLangTitle", "Quelle langue parlez-vous ?")}
          </h5>
        </div>

        <ListGroup className="!mb-0 !pl-0">
          <LanguageSelector onChangeLang={props.toggle} itemsDesign="radio" />
        </ListGroup>

        {!isMobile && (
          <ListGroupItem
            action
            tag="div"
            className={styles.list_group_item + " " + styles.unavailable}
          >
            <Row>
              <Col xs="8" className={cn(styles.vertical_center)}>
                <p className="mb-0">
                  {t("Homepage.traduire", "Vous pouvez nous aider à traduire !")}
                </p>
              </Col>
              <Col xs="4" className={styles.button_col}>
                <Button
                  linkProps={{
                    href: getPath("/traduire", locale),
                    prefetch: false,
                    onClick: props.toggle,
                  }}
                >
                  {t("Homepage.btnTranslate", "Traduire")}
                </Button>
              </Col>
            </Row>
          </ListGroupItem>
        )}
      </ModalBody>
    </Modal>
  );
};

export default LanguageModal;
