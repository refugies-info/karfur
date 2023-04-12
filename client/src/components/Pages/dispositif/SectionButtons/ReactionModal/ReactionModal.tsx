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
    <BaseModal show={true} toggle={toggle} title="Vous avez une suggestion ?" small>
      <p>Signalez-nous toute erreur ou suggestion de modification. Nous en tiendrons compte pour améliorer la page.</p>

      <textarea
        placeholder="J'écris ma suggestion ici"
        value={suggestion}
        onChange={(e: any) => setSuggestion(e.target.value)}
        className={styles.textarea}
      />

      <div className={styles.footer}>
        <Button secondary onClick={toggle} icon="close-outline" iconPlacement="end" className="me-4">
          Annuler
        </Button>
        <Button icon="checkmark-circle-2" iconPlacement="end" onClick={submit}>
          {t("Envoyer", "Envoyer")}
        </Button>
      </div>
    </BaseModal>
  );
};

export default ReactionModal;
