import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/SelectNext";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Event } from "~/lib/tracking";
import { isValidPhone } from "~/lib/validateFields";
import { allLanguesSelector, languei18nSelector } from "~/services/Langue/langue.selectors";
import API from "~/utils/API";

const MobileAppSmsForm = () => {
  const { t } = useTranslation();

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [languageSelected, setLanguageSelected] = useState<string | undefined>(undefined);
  const languages = useSelector(allLanguesSelector);
  const locale = useSelector(languei18nSelector);
  // auto select language
  useEffect(() => {
    if (locale) {
      const currentLocale = languages.find((ln) => ln.i18nCode === locale);
      if (currentLocale) setLanguageSelected(currentLocale.i18nCode);
    }
  }, [languages, locale]);

  const sendSMS = (e: any) => {
    setPhoneError("");
    e.preventDefault();
    if (isValidPhone(phone)) {
      API.smsDownloadApp({ phone, locale: languageSelected || "fr" })
        .then(() => {
          Swal.fire({
            title: "Yay...",
            text: "SMS envoyé !",
            icon: "success",
            timer: 1500,
          });
          Event("SEND_SMS", "download app", "homepage");
          setPhone("");
        })
        .catch((e) => {
          setPhoneError("Une erreur s'est produite");
        });
    } else {
      setPhoneError(t("Register.invalid_phone_number"));
    }
  };

  return (
    <form className="md:w-1/2">
      <Input
        nativeInputProps={{
          type: "text",
          value: phone,
          onChange: (e: any) => setPhone(e.target.value),
        }}
        label={t("MobileApp.phoneLabel")}
        state={phoneError !== "" ? "error" : "default"}
        stateRelatedMessage={phoneError}
        className="mb-4"
      />

      <Select
        label={t("MobileApp.langLabel")}
        nativeSelectProps={{
          name: "languageSelected",
          onChange: (event) => setLanguageSelected(event.target.value),
          value: languageSelected,
        }}
        options={languages.map((lang) => ({
          value: lang.i18nCode,
          label: lang.i18nCode === "fr" ? lang.langueLoc : `${lang.langueLoc} - ${lang.langueFr}`,
        }))}
      />

      <Button
        nativeButtonProps={{
          type: "submit",
        }}
        iconId="fr-icon-send-plane-fill"
        iconPosition="right"
        onClick={sendSMS}
        className="w-full justify-center"
      >
        {t("MobileApp.buttonText", "Envoyer le lien")}
      </Button>
    </form>
  );
};

export default MobileAppSmsForm;
