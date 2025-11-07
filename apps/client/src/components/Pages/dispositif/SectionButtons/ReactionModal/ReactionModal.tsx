import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Id } from "@refugies-info/api-types";
import { Modal } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { RefObject, useCallback, useRef, useState } from "react";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import { Event } from "~/lib/tracking";
import API from "~/utils/API";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callback: () => void;
  dispositifId?: Id;
  sectionKey: string;
  triggerRef?: RefObject<HTMLButtonElement>;
}

const ReactionModal = (props: Props) => {
  const { t } = useTranslation();

  const { open, dispositifId, sectionKey, callback, onOpenChange, triggerRef } = props;

  const [suggestion, setSuggestion] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const announce = useAnnounce();

  const [shouldTriggerCallback, setShouldTriggerCallback] = useState(false);
  const [hasError, setHasError] = useState(false);

  const submit = useCallback(async () => {
    if (!dispositifId) return;

    try {
      await API.addDispositifSuggestion(dispositifId.toString(), {
        suggestion,
        key: sectionKey,
      });

      // Clear any previous error
      setHasError(false);

      // Announce success BEFORE closing modal (while focus is still trapped)
      announce(t("Dispositif.reactFeedbackMessage"), { priority: "interrupt" });

      // Wait for announcement to start before closing modal
      setTimeout(() => {
        // Only close modal and show success if API call succeeds
        setShouldTriggerCallback(true); // Flag to trigger callback after modal closes
        onOpenChange(false);
        setSuggestion(""); // Clear the suggestion for next time
      }, 3000); // Give announcement time to start

      Event("REACTION", "Reaction send", dispositifId.toString());
    } catch (error) {
      // Set error state to show on Input
      setHasError(true);

      announce(t("Dispositif.suggestionErrorTitle"));
      announce(t("Dispositif.suggestionErrorText"));
    }
  }, [suggestion, dispositifId, sectionKey, onOpenChange, announce, t]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      title={t("Dispositif.suggestionTitle")}
      description={t("Dispositif.suggestionSubtitle")}
      closeLabel={t("close", "Fermer")}
      maxWidth="2xl"
      onOpenAutoFocus={(e) => {
        e.preventDefault();
        textareaRef.current?.focus();
      }}
      onCloseAutoFocus={(e) => {
        // Trigger callback after modal closes (if submission was successful)
        if (shouldTriggerCallback) {
          callback();
          setShouldTriggerCallback(false);
        }
      }}
    >
      <div className="space-y-8">
        <Input
          label={t("Dispositif.suggestionLabel", "Ma suggestion (Obligatoire)")}
          textArea
          state={hasError ? "error" : "default"}
          stateRelatedMessage={
            hasError ? t("Dispositif.suggestionErrorTitle") + " " + t("Dispositif.suggestionErrorText") : undefined
          }
          nativeTextAreaProps={{
            ref: textareaRef,
            onChange: (e: any) => {
              setSuggestion(e.target.value);
              // Clear error when user starts typing
              if (hasError) setHasError(false);
            },
            value: suggestion,
          }}
        />

        <div className="flex justify-end">
          <Button iconId="fr-icon-checkbox-circle-fill" onClick={submit} disabled={!suggestion.trim()}>
            {t("Valider", "Valider")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReactionModal;
