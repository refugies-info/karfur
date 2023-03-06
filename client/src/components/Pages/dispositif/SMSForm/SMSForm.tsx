import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { colors } from "colors";
import { useLocale } from "hooks";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import { isValidPhone } from "lib/validateFields";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Toast from "components/UI/Toast";
import Tooltip from "components/UI/Tooltip";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import API from "utils/API";
import LangueMenu from "../LangueMenu";
import styles from "./SMSForm.module.scss";

const SMSForm = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [selectedLn, setSelectedLn] = useState<string>(locale);
  const [tel, setTel] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const dispositif = useSelector(selectedDispositifSelector);

  const sendSMS = () => {
    setError(null);
    if (isValidPhone(tel)) {
      Event("Share", "SMS", "from dispositif sidebar");
      API.smsContentLink({
        phone: tel,
        title: dispositif.titreInformatif,
        url: window.location.href,
      })
        .then(() => {
          setTel("");
          setSelectedLn("fr");
          setError(null);
          setShowToast(true);
        })
        .catch((e) => setError(e.message));
    } else {
      setError(t("Register.Ceci n'est pas un numéro de téléphone valide, vérifiez votre saisie"));
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        Envoyer par SMS
        <EVAIcon name="info-outline" size={20} fill="black" className="ms-2" id="SMSTooltip" />
        <Tooltip target="SMSTooltip">Vous restez anonyme : le SMS est envoyé avec un numéro Réfugiés.info.</Tooltip>
      </p>
      <div className={styles.input}>
        <input
          type="tel"
          placeholder="N° de téléphone"
          value={tel}
          onChange={(e: any) => setTel(e.target.value)}
          className={cls(!!error && styles.input_error)}
        />
        <span className={styles.divider} />
        <LangueMenu label="en" selectedLn={selectedLn} setSelectedLn={setSelectedLn} />
      </div>
      <Button icon="paper-plane-outline" className={styles.submit} disabled={!tel} onClick={sendSMS}>
        Envoyer
      </Button>
      {error && (
        <div className={styles.error}>
          <EVAIcon name="alert-triangle" size={16} fill={colors.error} className="me-2" />
          <p>{error}</p>
        </div>
      )}
      {showToast && <Toast close={() => setShowToast(false)}>SMS envoyé !</Toast>}
    </div>
  );
};

export default SMSForm;
