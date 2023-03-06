import React, { useCallback, useState } from "react";
import { Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useTranslation } from "next-i18next";
import { colors } from "colors";
import { Id } from "api-types";
import API from "utils/API";
import { handleApiError } from "lib/handleApiErrors";
import FButton from "../../UI/FButton/FButton";
import styles from "./ReactionModal.module.scss";

interface Props {
  toggle: () => void;
  callback: () => void;
  dispositifId?: Id;
  sectionKey: string;
}

const ReactionModal = (props: Props) => {
  const { t } = useTranslation();

  const [suggestion, setSuggestion] = useState("");
  const submit = useCallback(async () => {
    if (!props.dispositifId) return;
    API.addDispositifSuggestion(props.dispositifId.toString(), {
      suggestion,
      key: props.sectionKey,
    })
      .then(() => {
        props.callback();
        props.toggle();
      })
      .catch(() => {
        handleApiError({
          title: "Oups, une erreur s'est produite",
          text: "Veuillez réessayer ou contacter un administrateur",
        });
      });
  }, [suggestion, props.dispositifId, props.sectionKey]);

  return (
    <Modal isOpen={true} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <ModalHeader className={styles.modal_header} toggle={props.toggle}>
        {t("Dispositif.Envoyer une réaction", "Envoyer une réaction")}
      </ModalHeader>
      <ModalBody className={styles.modal_body}>
        <div className={styles.inner}>
          {t("Dispositif.Dites nous ce que vous pensez", "Dites nous ce que vous pensez :")}
        </div>

        <Input
          type="textarea"
          className={styles.input}
          placeholder="J'écris ici ma réaction"
          rows={5}
          value={suggestion}
          onChange={(e: any) => setSuggestion(e.target.value)}
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
        <FButton type="validate" name="checkmark" onClick={submit}>
          {t("Envoyer", "Envoyer")}
        </FButton>
      </ModalFooter>
    </Modal>
  );
};

export default ReactionModal;
