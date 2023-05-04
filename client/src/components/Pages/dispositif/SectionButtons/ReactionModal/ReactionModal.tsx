import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import { Id } from "api-types";
import API from "utils/API";
import { handleApiError } from "lib/handleApiErrors";
import Button from "components/UI/Button";
import BaseModal from "../../BaseModal";
import styles from "./ReactionModal.module.scss";

interface Props {
  toggle: () => void;
  callback: () => void;
  dispositifId?: Id;
  sectionKey: string;
}

const ReactionModal = (props: Props) => {
  const { t } = useTranslation();

  const { dispositifId, sectionKey, callback, toggle } = props;

  const [suggestion, setSuggestion] = useState("");
  const submit = useCallback(async () => {
    if (!dispositifId) return;
    API.addDispositifSuggestion(dispositifId.toString(), {
      suggestion,
      key: sectionKey,
    })
      .then(() => {
        callback();
        toggle();
      })
      .catch(() => {
        handleApiError({
          title: "Oups, une erreur s'est produite",
          text: "Veuillez réessayer ou contacter un administrateur",
        });
      });
  }, [suggestion, dispositifId, sectionKey, callback, toggle]);

  return (
    <BaseModal show={true} toggle={toggle} title={t("Dispositif.suggestionTitle")} small>
      <p>{t("Dispositif.suggestionSubtitle")}</p>

      <textarea
        placeholder={t("Dispositif.suggestionPlaceholder")}
        value={suggestion}
        onChange={(e: any) => setSuggestion(e.target.value)}
        className={styles.textarea}
      />

      <div className={styles.footer}>
        <Button priority="secondary" onClick={toggle} evaIcon="close-outline" iconPosition="right" className="me-4">
          {t("Annuler", "Annuler")}
        </Button>
        <Button evaIcon="checkmark-circle-2" iconPosition="right" onClick={submit}>
          {t("Envoyer", "Envoyer")}
        </Button>
      </div>
    </BaseModal>
  );
};

export default ReactionModal;
