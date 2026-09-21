import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import SMSForm from "~/components/Pages/dispositif/SMSForm";
import Toast from "~/components/UI/Toast";
import { Event } from "~/lib/tracking";

// Native <dialog>-based modal (same pattern as the mobile filters modal in
// trouver-cours-francais.tsx): the SMS form must overlay the page instead of pushing content
// down in the normal flow, and this gives us the focus-trap/Escape-close for free.
const smsModal = createModal({
  id: "course-results-sms-modal",
  isOpenedByDefault: false,
});

export const ShareResultsButtons = () => {
  const { t } = useTranslation();
  const [showToastLink, setShowToastLink] = useState(false);
  const smsButtonRef = useRef<HTMLButtonElement>(null);
  const smsFormInputContainerRef = useRef<HTMLDivElement>(null);
  const isSmsModalOpen = useIsModalOpen(smsModal, {
    onConceal: () => smsButtonRef.current?.focus(),
  });

  const copyLink = useCallback(() => {
    Event("Share", "Copy", "from french course results");
    navigator.clipboard.writeText(window.location.href).then(
      () => setShowToastLink(true),
      () => setShowToastLink(false),
    );
  }, []);

  const print = useCallback(() => {
    Event("Share", "Print", "from french course results");
    window.print();
  }, []);

  // Same pattern as ShareButtons.tsx: move focus into the form once it's rendered.
  useEffect(() => {
    if (!isSmsModalOpen) return undefined;
    const timeout = setTimeout(() => {
      smsFormInputContainerRef.current?.querySelector("input")?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, [isSmsModalOpen]);

  return (
    <div className="flex flex-col gap-2 print:hidden">
      <div className="flex items-center gap-2">
        <span className="text-default-grey text-base">
          {t("LearnFrench.share_title", "Partager la liste :")}
        </span>
        <Button
          ref={smsButtonRef}
          priority="tertiary"
          onClick={() => smsModal.open()}
          iconId="fr-icon-chat-3-line"
        >
          {t("Dispositif.sms", "SMS")}
        </Button>
        <Button
          priority="tertiary"
          onClick={copyLink}
          iconId="fr-icon-link"
          title={t("Dispositif.tooltipShareCopy")}
          nativeButtonProps={{ "aria-label": t("Dispositif.tooltipShareCopy") }}
        />
        <Button
          priority="tertiary"
          onClick={print}
          iconId="fr-icon-printer-line"
          title={t("Dispositif.tooltipSharePrint")}
          nativeButtonProps={{ "aria-label": t("Dispositif.tooltipSharePrint") }}
        />
      </div>

      <smsModal.Component title={t("Dispositif.sms", "SMS")}>
        <SMSForm onSubmitSuccess={() => smsModal.close()} ref={smsFormInputContainerRef} />
      </smsModal.Component>

      <Toast open={showToastLink} closeCallback={() => setShowToastLink(false)}>
        {t("Dispositif.toastShareCopied")}
      </Toast>
    </div>
  );
};
