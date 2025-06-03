import { Input } from "@codegouvfr/react-dsfr/Input";
import { Id } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";
import BaseModal from "~/components/UI/BaseModal";
import Button from "~/components/UI/Button";
import { handleApiError } from "~/lib/handleApiErrors";
import { Event } from "~/lib/tracking";
import API from "~/utils/API";
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
        Event("REACTION", "Reaction send", dispositifId.toString());
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

      <Input
        label={t("Dispositif.suggestionLabel", "Ma suggestion")}
        textArea
        nativeTextAreaProps={{
          onChange: (e: any) => setSuggestion(e.target.value),
        }}
      />

      <div className={styles.footer}>
        <Button evaIcon="checkmark-circle-2" iconPosition="right" onClick={submit}>
          {t("Valider", "Valider")}
        </Button>
      </div>
    </BaseModal>
  );
};

export default ReactionModal;
