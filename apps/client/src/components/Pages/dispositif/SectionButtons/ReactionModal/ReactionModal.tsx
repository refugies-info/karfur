import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import * as Dialog from "@radix-ui/react-dialog";
import { Id } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { RefObject, useCallback, useRef, useState } from "react";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import { Event } from "~/lib/tracking";
import API from "~/utils/API";
interface Props {
  open: boolean;
  toggle: () => void;
  callback: () => void;
  dispositifId?: Id;
  sectionKey: string;
  triggerRef?: RefObject<HTMLButtonElement>;
}

const ReactionModal = (props: Props) => {
  const { t } = useTranslation();

  const { open, dispositifId, sectionKey, callback, toggle, triggerRef } = props;

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
        toggle();
        setSuggestion(""); // Clear the suggestion for next time
      }, 3000); // Give announcement time to start

      Event("REACTION", "Reaction send", dispositifId.toString());
    } catch (error) {
      // Set error state to show on Input
      setHasError(true);

      announce(t("Dispositif.suggestionErrorTitle"));
      announce(t("Dispositif.suggestionErrorText"));
    }
  }, [suggestion, dispositifId, sectionKey, toggle, announce, t]);

  return (
    <Dialog.Root open={open} onOpenChange={toggle}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[1000] bg-black/50" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 z-[1001] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col bg-white p-8 shadow-[0_2px_6px_0_rgb(0_0_18_/_16.1%)] focus:outline-none max-sm:w-[95vw] max-sm:max-w-[95vw] max-sm:p-6"
          aria-describedby="reaction-modal-description"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            textareaRef.current?.focus();
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            // Return focus to trigger button
            triggerRef?.current?.focus();
            // Trigger callback after modal closes (if submission was successful)
            if (shouldTriggerCallback) {
              callback();
              setShouldTriggerCallback(false);
            }
          }}
        >
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <Dialog.Title className="m-0 mb-6 text-2xl">{t("Dispositif.suggestionTitle")}</Dialog.Title>
              <Dialog.Description id="reaction-modal-description" className="m-0 text-lg text-gray-700">
                {t("Dispositif.suggestionSubtitle")}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                iconId="fr-icon-close-line"
                priority="tertiary no outline"
                className="ml-4"
                title={t("close", "Fermer")}
                aria-label={t("close", "Fermer")}
              >
                {t("close", "Fermer")}
              </Button>
            </Dialog.Close>
          </div>

          <div className="mb-8">
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
          </div>

          <div className="flex justify-end">
            <Button iconId="fr-icon-checkbox-circle-fill" onClick={submit} disabled={!suggestion.trim()}>
              {t("Valider", "Valider")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ReactionModal;
