import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { Collapse } from "reactstrap";
import { useLocale } from "hooks";
import { isValidPhone } from "lib/validateFields";
import { Event } from "lib/tracking";
import { cls } from "lib/classname";
import API from "utils/API";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import MobileModal from "components/Modals/MobileModal";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Flag from "components/UI/Flag";
import LangueSelectList from "../../LangueSelectList";
import styles from "./SendSMSModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const SendSMSModal = (props: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [selectedLn, setSelectedLn] = useState<string>(locale);
  const [lnListOpen, setLnListOpen] = useState(false);
  const [tel, setTel] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const dispositif = useSelector(selectedDispositifSelector);
  const languages = useSelector(allLanguesSelector);

  const sendSMS = () => {
    setError(null);
    if (isValidPhone(tel)) {
      Event("Share", "SMS", "from dispositif sidebar");
      API.smsContentLink({
        phone: tel,
        title: dispositif?.titreInformatif || "",
        url: window.location.href,
        locale: selectedLn,
      })
        .then(() => {
          setTel("");
          setSelectedLn(locale);
          setError(null);
          props.toggle();
        })
        .catch((e) => setError(e.message));
    } else {
      setError(t("Register.Ceci n'est pas un numéro de téléphone valide, vérifiez votre saisie"));
    }
  };

  // on select language, close menu
  useEffect(() => {
    setLnListOpen(false);
  }, [selectedLn]);

  // when locale change, change language
  useEffect(() => {
    setSelectedLn(locale);
  }, [locale]);

  // close menu when click outside
  const menuRef = useRef<HTMLDivElement | null>(null);
  const onClickOutsideMenu = (e: any) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Element)) {
      setLnListOpen(false);
    }
  };

  const disabledOptions = useMemo(
    () => languages.map((ln) => ln.i18nCode).filter((ln) => !(dispositif?.availableLanguages || []).includes(ln)),
    [dispositif, languages],
  );

  const selectedLanguage = languages.find((ln) => ln.i18nCode === selectedLn);

  return (
    <MobileModal title="Envoyer par SMS" show={props.show} toggle={props.toggle} onClick={onClickOutsideMenu}>
      <div className={styles.form}>
        <p className={styles.text}>{t("Dispositif.smsFormHelp")}</p>
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            sendSMS();
          }}
        >
          <input
            type="tel"
            placeholder={t("Homepage.mobileAppFormLabel")}
            value={tel}
            onChange={(e: any) => setTel(e.target.value)}
            className={cls(styles.input, !!error && styles.input_error)}
          />
          <div ref={menuRef}>
            <Button
              onClick={() => setLnListOpen((o) => !o)}
              colors={[styles.lightBackgroundElevationAlt, styles.gray90]}
              className={styles.btn}
            >
              <span>
                {t("Dispositif.smsFormLanguage")} {selectedLanguage?.langueFr?.toLowerCase()}
                <Flag langueCode={selectedLanguage?.langueCode} className="ms-2" />
              </span>
              <EVAIcon
                name="chevron-down-outline"
                size={24}
                fill="dark"
                className={cls(styles.icon, lnListOpen && styles.open)}
              />
            </Button>
            <Collapse isOpen={lnListOpen}>
              <LangueSelectList
                selectedLn={selectedLn}
                setSelectedLn={setSelectedLn}
                disabledOptions={disabledOptions}
              />
            </Collapse>
          </div>

          {error && (
            <div className={styles.error}>
              <EVAIcon name="alert-triangle" size={24} fill={styles.lightTextDefaultError} className="me-2" />
              <p>{error}</p>
            </div>
          )}
          <Button icon="paper-plane-outline" iconPlacement="end" className={styles.submit} disabled={!tel} submit>
            {t("Envoyer")}
          </Button>
        </form>
      </div>
    </MobileModal>
  );
};

export default SendSMSModal;
