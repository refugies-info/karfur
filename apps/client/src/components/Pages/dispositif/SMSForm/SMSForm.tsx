import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Button from "~/components/UI/Button";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import Toast from "~/components/UI/Toast";
import Tooltip from "~/components/UI/Tooltip";
import { useLocale, useSendSms } from "~/hooks";
import { isValidPhone } from "~/lib/validateFields";
import { allLanguesSelector } from "~/services/Langue/langue.selectors";
import { colors } from "~/utils/colors";
import Input from "../Input";
import LangueMenu from "../LangueMenu";
import styles from "./SMSForm.module.scss";

interface Props {
  disabledOptions: string[];
}

const SMSForm = (props: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const [selectedLn, setSelectedLn] = useState<string>(locale);
  const languages = useSelector(allLanguesSelector);
  const language = useMemo(() => languages.find((ln) => ln.i18nCode === selectedLn), [languages, selectedLn]);

  const [tel, setTel] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const { sendSMS } = useSendSms();

  const send = () => {
    setError(null);
    if (isValidPhone(tel)) {
      sendSMS(tel, selectedLn)
        .then(() => {
          setTel("");
          setSelectedLn("fr");
          setError(null);
          setShowToast(true);
        })
        .catch((e) => setError(e.message));
    } else {
      setError(t("Register.invalid_phone_number"));
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        {t("Dispositif.sendBySMS")}
        <EVAIcon name="info-outline" size={20} fill="black" className="ms-2" id="SMSTooltip" />
        <Tooltip target="SMSTooltip">{t("Dispositif.smsFormHelp")}</Tooltip>
      </p>
      <Input
        id="sms-phone-input"
        type="tel"
        label={t("Homepage.mobileAppFormLabel")}
        icon="phone-outline"
        value={tel}
        onChange={(e: any) => setTel(e.target.value)}
        error={error}
        className="mb-4"
      />
      <LangueMenu
        label={`${t("Dispositif.smsFormLanguageShort")} ${(language?.langueFr || "français").toLowerCase()}`}
        selectedLn={selectedLn}
        setSelectedLn={setSelectedLn}
        className={styles.language}
        disabledOptions={props.disabledOptions}
      />
      <Button
        evaIcon="paper-plane-outline"
        iconPosition="right"
        className={styles.submit}
        disabled={!tel}
        onClick={send}
      >
        {t("Envoyer")}
      </Button>
      {error && (
        <div className={styles.error}>
          <EVAIcon name="alert-triangle" size={16} fill={colors.error} className="me-2" />
          <p>{error}</p>
        </div>
      )}
      <Toast open={showToast} closeCallback={() => setShowToast(false)}>
        {t("Dispositif.smsFormSent")}
      </Toast>
    </div>
  );
};

export default SMSForm;
