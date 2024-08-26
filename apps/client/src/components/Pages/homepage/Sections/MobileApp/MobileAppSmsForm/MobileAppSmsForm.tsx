import FButton from "@/components/UI/FButton";
import Input from "@/components/UI/Input";
import { Event } from "@/lib/tracking";
import { isValidPhone } from "@/lib/validateFields";
import { allLanguesSelector, languei18nSelector } from "@/services/Langue/langue.selectors";
import API from "@/utils/API";
import { GetLanguagesResponse } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import LanguageDropdown from "../LanguageDropdown";
import styles from "./MobileAppSmsForm.module.scss";

const MobileAppSmsForm = () => {
  const { t } = useTranslation();

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [languageSelected, setLanguageSelected] = useState<GetLanguagesResponse | undefined>(undefined);
  const languages = useSelector(allLanguesSelector);
  const locale = useSelector(languei18nSelector);
  // auto select language
  useEffect(() => {
    if (locale) {
      const currentLocale = languages.find((ln) => ln.i18nCode === locale);
      if (currentLocale) setLanguageSelected(currentLocale);
    }
  }, [languages, locale]);
  const onSelectItem = (language: GetLanguagesResponse) => setLanguageSelected(language);

  const sendSMS = (e: any) => {
    setPhoneError("");
    e.preventDefault();
    if (isValidPhone(phone)) {
      API.smsDownloadApp({ phone, locale: languageSelected?.i18nCode || "fr" })
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
    <div className={styles.container}>
      <label>{t("Homepage.mobileAppFormLabelDetails")}</label>
      <div className={styles.sms_form}>
        <Input
          type="text"
          placeholder={t("Homepage.mobileAppFormLabel")}
          className={styles.input}
          value={phone}
          onChange={(e: any) => setPhone(e.target.value)}
          error={phoneError}
        />
        <div className={styles.options}>
          <LanguageDropdown languageSelected={languageSelected} onSelectItem={onSelectItem} />
          <FButton
            type="validate"
            className={styles.submit}
            name="checkmark-outline"
            disabled={!phone}
            onClick={sendSMS}
          >
            {t("Ok", "Ok")}
          </FButton>
        </div>
      </div>
      <p className={styles.instructions}>{t("Homepage.mobileAppFormInstructions")}</p>
    </div>
  );
};

export default MobileAppSmsForm;
