import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import { useCallback, useRef, useState } from "react";
import SMSForm from "~/components/Pages/dispositif/SMSForm";
import Toast from "~/components/UI/Toast";
import { Event } from "~/lib/tracking";

export const ShareResultsButtons = () => {
  const { t } = useTranslation();
  const [showSMS, setShowSMS] = useState(false);
  const [showToastLink, setShowToastLink] = useState(false);
  const smsFormInputContainerRef = useRef<HTMLDivElement>(null);

  const copyLink = useCallback(() => {
    Event("Share", "Copy", "from french course results");
    navigator.clipboard.writeText(window.location.href);
    setShowToastLink(true);
  }, []);

  const print = useCallback(() => {
    Event("Share", "Print", "from french course results");
    window.print();
  }, []);

  return (
    <div className="flex flex-col gap-2 print:hidden">
      <div className="flex items-center gap-2">
        <span className="text-default-grey text-base">
          {t("LearnFrench.share_title", "Partager la liste :")}
        </span>
        <Button
          priority="tertiary"
          onClick={() => setShowSMS((open) => !open)}
          iconId={showSMS ? "fr-icon-chat-3-line" : "fr-icon-chat-3-line"}
        >
          {t("Dispositif.sms", "SMS")}
        </Button>
        <Button
          priority="tertiary"
          onClick={copyLink}
          iconId="fr-icon-link"
          title={t("Dispositif.tooltipShareCopy")}
        />
        <Button
          priority="tertiary"
          onClick={print}
          iconId="fr-icon-printer-line"
          title={t("Dispositif.tooltipSharePrint")}
        />
      </div>

      {showSMS && (
        <div className="border-default-grey max-w-[28rem] border bg-white p-4 shadow-[0_2px_6px_0_rgba(0,0,18,0.16)]">
          <SMSForm onSubmitSuccess={() => setShowSMS(false)} ref={smsFormInputContainerRef} />
        </div>
      )}

      <Toast open={showToastLink} closeCallback={() => setShowToastLink(false)}>
        {t("Dispositif.toastShareCopied")}
      </Toast>
    </div>
  );
};
