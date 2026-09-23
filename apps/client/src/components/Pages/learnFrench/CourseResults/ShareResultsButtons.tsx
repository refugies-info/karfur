import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import SMSForm from "~/components/Pages/dispositif/SMSForm";
import Toast from "~/components/UI/Toast";
import useLocale from "~/hooks/useLocale";
import { summarizeLocations } from "~/lib/learnFrench/summarizeLocations";
import { Event } from "~/lib/tracking";
import API from "~/utils/API";

const smsModal = createModal({
  id: "course-results-sms-modal",
  isOpenedByDefault: false,
});

interface Props {
  departments: string[];
  cities: string[];
}

export const ShareResultsButtons = (props: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [showToastLink, setShowToastLink] = useState(false);
  const smsButtonRef = useRef<HTMLButtonElement>(null);
  const smsFormInputContainerRef = useRef<HTMLDivElement>(null);
  const isSmsModalOpen = useIsModalOpen(smsModal, {
    onConceal: () => smsButtonRef.current?.focus(),
  });

  const location = summarizeLocations([...props.departments, ...props.cities]);
  const sendCourseListSms = useCallback(
    (tel: string, smsLocale: string) =>
      API.smsCourseListLink({
        phone: tel,
        url: window.location.href,
        locale: smsLocale,
        location: location || undefined,
      }),
    [location],
  );

  const copyLink = useCallback(() => {
    Event("Share", "Copy", "from french course results");
    navigator.clipboard.writeText(window.location.href).then(
      () => setShowToastLink(true),
      () => setShowToastLink(false),
    );
  }, []);

  const print = useCallback(() => {
    Event("Share", "Print", "from french course results");
    const localePrefix = locale === "fr" ? "" : `/${locale}`;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.top = "-10000px";
    iframe.style.left = "-10000px";
    iframe.setAttribute("aria-hidden", "true");
    iframe.src = `${localePrefix}/trouver-cours-francais/print${window.location.search}`;

    const cleanup = () => iframe.remove();
    iframe.addEventListener("load", () => {
      iframe.contentWindow?.addEventListener("afterprint", cleanup);
      setTimeout(cleanup, 60_000);
    });
    document.body.appendChild(iframe);
  }, [locale]);

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
        <SMSForm
          onSubmitSuccess={() => smsModal.close()}
          onSend={sendCourseListSms}
          restrictToAvailableLanguages={false}
          ref={smsFormInputContainerRef}
        />
      </smsModal.Component>

      <Toast open={showToastLink} closeCallback={() => setShowToastLink(false)}>
        {t("Dispositif.toastShareCopied")}
      </Toast>
    </div>
  );
};
