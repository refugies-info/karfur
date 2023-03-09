import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import API from "utils/API";
import Swal from "sweetalert2";
import { isValidPhone } from "lib/validateFields";
import { languei18nSelector, allLanguesSelector } from "services/Langue/langue.selectors";
import Input from "components/UI/Input";
import FButton from "components/UI/FButton";
import LanguageDropdown from "../LanguageDropdown";
import styles from "./MobileAppSmsForm.module.scss";
import { GetLanguagesResponse } from "api-types";

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
            timer: 1500
          });
          setPhone("");
        })
        .catch((e) => {
          setPhoneError("Une erreur s'est produite");
        });
    } else {
      setPhoneError(t("Register.Ceci n'est pas un numéro de téléphone valide, vérifiez votre saisie"));
    }
  };

  return (
    <div className={styles.container}>
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
            OK
          </FButton>
        </div>
      </div>
      <p className={styles.instructions}>{t("Homepage.mobileAppFormInstructions")}</p>
    </div>
  );
};

export default MobileAppSmsForm;
