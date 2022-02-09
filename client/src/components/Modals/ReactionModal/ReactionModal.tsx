import React from "react";
import { Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useTranslation } from "next-i18next";
import {colors} from "colors";

import FButton from "../../FigmaUI/FButton/FButton";
import styles from "./ReactionModal.module.scss";

interface Props {
  showModals: any
  toggleModal: any
  suggestion: any
  onChange: any
  onValidate: any
}

const ReactionModal = (props: Props) => {
  const { t } = useTranslation();
  const isOpen = props.showModals.reaction;
  let name = "reaction";
  let fieldName = "suggestions";

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => props.toggleModal(false, name)}
      className={styles.modal}
      contentClassName={styles.modal_content}
    >
      <ModalHeader
        className={styles.modal_header}
        toggle={() => props.toggleModal(false, name)}
      >
        {t("Dispositif.Envoyer une réaction", "Envoyer une réaction")}
      </ModalHeader>
      <ModalBody className={styles.modal_body}>
        <div className={styles.inner}>
          {t(
            "Dispositif.Dites nous ce que vous pensez",
            "Dites nous ce que vous pensez :"
          )}
        </div>

        <Input
          type="textarea"
          className={styles.input}
          placeholder="J'écris ici ma réaction"
          rows={5}
          value={props.suggestion}
          onChange={props.onChange}
          id="suggestion"
        />
      </ModalBody>
      <ModalFooter className={styles.modal_footer}>
        <FButton
          tag="a"
          href="https://help.refugies.info/fr/"
          target="_blank"
          rel="noopener noreferrer"
          type="help"
          name="question-mark-circle-outline"
          fill={colors.error}
        >
          {t("Login.Centre d'aide", "Centre d'aide")}
        </FButton>
        <FButton
          type="validate"
          name="checkmark"
          onClick={() => props.onValidate(name, fieldName)}
        >
          {t("Envoyer", "Envoyer")}
        </FButton>
      </ModalFooter>
    </Modal>
  );
};

export default ReactionModal;
