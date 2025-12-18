import Button from "@codegouvfr/react-dsfr/Button";
import { Tooltip } from "@codegouvfr/react-dsfr/Tooltip";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import SMSForm from "~/components/Pages/dispositif/SMSForm";
import Toast from "~/components/UI/Toast";
import { cn } from "~/lib/classname";
import { Event } from "~/lib/tracking";

const ShareButtons = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [showSMS, setShowSMS] = useState(false);
  const [showToastLink, setShowToastLink] = useState(false);

  const smsFormInputContainerRef = useRef<HTMLDivElement>(null);

  const copyLink = useCallback(() => {
    Event("Share", "Copy", "from dispositif sidebar");
    navigator.clipboard.writeText(window.location.href);
    setShowToastLink(true);
  }, []);

  const print = useCallback(() => {
    Event("Share", "Print", "from dispositif sidebar");
    window.print();
  }, []);

  useEffect(() => {
    if (showSMS) {
      const timeout = setTimeout(() => {
        if (smsFormInputContainerRef.current) {
          const inputElement = smsFormInputContainerRef.current.querySelector("input");
          if (inputElement) {
            inputElement.focus();
          }
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [showSMS]);

  return (
    <div className="mb-4 flex flex-col gap-2 print:hidden">
      <div className={cn("bg-white/50 p-4 backdrop-blur-[30px]", className)}>
        <p className="text-title-xxs text-title-grey mb-4 font-bold">
          {t("Dispositif.share", "Partager la fiche")}
        </p>
        <div className="flex items-center">
          <Tooltip kind="hover" title={t("Dispositif.sendBySMS")}>
            <Button
              priority="tertiary no outline"
              onClick={() => setShowSMS(!showSMS)}
              iconId={showSMS ? "ri-chat-3-fill" : "ri-chat-3-line"}
              id="SmsTooltip"
              title={t("Dispositif.sendBySMS")}
              ref={closeButtonRef}
              className={cn("rtl:before:!ml-[0.25rem]", showSMS && "!text-[#1212ff]")}
            >
              {t("Dispositif.sms", "SMS")}
            </Button>
          </Tooltip>

          <Tooltip kind="hover" title={t("Dispositif.tooltipShareCopy")}>
            <Button
              priority="tertiary no outline"
              onClick={copyLink}
              iconId="fr-icon-link"
              id="CopyTooltip"
              title={t("Dispositif.tooltipShareCopy")}
            />
          </Tooltip>

          <Tooltip kind="hover" title={t("Dispositif.tooltipSharePrint")}>
            <Button
              priority="tertiary no outline"
              onClick={print}
              iconId="fr-icon-printer-line"
              id="PrintTooltip"
              title={t("Dispositif.tooltipSharePrint")}
            />
          </Tooltip>
        </div>

        <Toast open={showToastLink} closeCallback={() => setShowToastLink(false)}>
          {t("Dispositif.toastShareCopied")}
        </Toast>
      </div>
      <div
        className={cn(
          "relative flex max-h-0 flex-col items-start justify-start overflow-clip bg-white shadow-[0px_2px_6px_0px_rgba(0,0,18,0.16)] transition-all duration-800 ease-in",
          showSMS ? "max-h-[28rem]" : "max-h-0",
          !showSMS && "!hidden",
        )}
      >
        <Button
          priority="tertiary no outline"
          onClick={() => setShowSMS(false)}
          iconId="ri-close-line"
          className={cn("z-10 ml-auto", !showSMS && "!hidden")}
          size="small"
          title={t("close")}
        />
        <SMSForm
          onSubmitSuccess={() => {
            setShowSMS(false);
            closeButtonRef.current?.focus();
          }}
          className="p-4 pt-0"
          ref={smsFormInputContainerRef}
        />
      </div>
    </div>
  );
};

export default ShareButtons;
