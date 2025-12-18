import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import Notice from "@codegouvfr/react-dsfr/Notice";
import Select from "@codegouvfr/react-dsfr/Select";
import { useTranslation } from "next-i18next";
import { forwardRef, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import Toast from "~/components/UI/Toast";
import { useLocale, useSendSms } from "~/hooks";
import { isValidPhone } from "~/lib/validateFields";
import { allLanguesSelector } from "~/services/Langue/langue.selectors";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";

interface Props {
  className?: string;
  onSubmitSuccess?: () => void;
}

const SMSForm = forwardRef<HTMLDivElement, Props>(({ className, onSubmitSuccess }, ref) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const dispositif = useSelector(selectedDispositifSelector);
  const announce = useAnnounce();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedLang, setSelectedLang] = useState<string>(locale);
  const languages = useSelector(allLanguesSelector);

  const selectOptions = useMemo(
    () =>
      languages.map((lang) => {
        return {
          ...lang,
          disabled: !(dispositif?.availableLanguages || []).includes(lang.i18nCode),
        };
      }),
    [languages, dispositif],
  );

  const [tel, setTel] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const { sendSMS } = useSendSms();

  const send = () => {
    setError(false);
    setIsLoading(true);
    if (isValidPhone(tel)) {
      sendSMS(tel, selectedLang)
        .then(() => {
          setIsLoading(false);
          setTel("");
          setSelectedLang(locale);
          setError(false);
          setShowToast(true);
          announce(t("Dispositif.smsFormSent"));
          setShowToast(false);
          setTimeout(() => {
            onSubmitSuccess?.();
          }, 2000);
        })
        .catch((e) => {
          setIsLoading(false);
          setError(true);
          setErrorMessage(e.message);
        });
    } else {
      setIsLoading(false);
      setError(true);
      setErrorMessage(t("Register.invalid_phone_number"));
    }
  };

  return (
    <div className={className}>
      <Input
        id="sms-phone-input"
        ref={ref}
        nativeInputProps={{
          type: "tel",
          name: "tel",
          onChange: (e: any) => setTel(e.target.value),
        }}
        label={t("MobileApp.phoneLabel", "Numéro de téléphone (requis)")}
        state={error ? "error" : "default"}
        stateRelatedMessage={errorMessage}
        className="mb-4"
      />

      <Select
        id="sms-language-select"
        nativeSelectProps={{
          name: "sms-language-select",
          value: selectedLang,
          onChange: (e: any) => setSelectedLang(e.target.value),
        }}
        label={t("Dispositif.smsFormLanguage", "Langue")}
        className="mb-4"
      >
        {selectOptions.map((ln) => (
          <option key={ln.i18nCode} value={ln.i18nCode}>
            {ln.langueFr}
          </option>
        ))}
      </Select>

      <Button
        iconId="fr-icon-send-plane-line"
        className="w-full justify-center"
        iconPosition="right"
        disabled={!tel || isLoading}
        onClick={send}
      >
        {isLoading ? t("send_in_progress", "Envoi en cours...") : t("Envoyer", "Envoyer")}
      </Button>

      <Notice
        title={t("Dispositif.smsFormHelp")}
        severity="info"
        className="[&_*]:text-corps-xs w-full bg-transparent !pb-0 [&_*]:p-0 [&_*]:font-normal [&_span]:flex"
      />

      <Toast open={showToast} closeCallback={() => setShowToast(false)}>
        {t("Dispositif.smsFormSent")}
      </Toast>
    </div>
  );
});

SMSForm.displayName = "SMSForm";
export default SMSForm;
