import { GetLanguagesResponse } from "api-types";
import { colors } from "colors";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import API from "utils/API";
import styles from "./SMSForm.module.scss";

const SMSForm = () => {
  const [selectedLn, setSelectedLn] = useState<string>("fr");
  const [tel, setTel] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const languages = useSelector(allLanguesSelector);
  const [open, setOpen] = useState(false);
  const dispositif = useSelector(selectedDispositifSelector);

  const onClickItem = (language: GetLanguagesResponse) => {
    if (language.i18nCode) setSelectedLn(language.i18nCode);
    setOpen(false);
  };

  const sendSMS = () => {
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
      })
      .catch((e) => setError(e.message));
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        Envoyer par SMS
        <EVAIcon name="info-outline" size={20} fill="black" className="ms-2" />
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
        <Dropdown isOpen={open} direction="down" toggle={() => setOpen((o) => !o)} className={styles.dropdown}>
          <DropdownToggle>
            en&nbsp;
            <span className={cls(styles.flag, `ms-2 fi fi-${selectedLn}`)} title={selectedLn} id={selectedLn} />
          </DropdownToggle>
          <DropdownMenu className={styles.menu}>
            {languages.map((ln, i) => (
              <DropdownItem
                key={i}
                onClick={() => onClickItem(ln)}
                className={cls(styles.item, ln.i18nCode === selectedLn && styles.selected)}
                toggle={false}
              >
                <span
                  className={cls(styles.flag, `me-2 fi fi-${ln.langueCode}`)}
                  title={ln.langueCode}
                  id={ln.langueCode}
                />
                <span className={styles.item_locale}>{ln.langueFr} -</span>
                <span>{ln.langueLoc}</span>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
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
    </div>
  );
};

export default SMSForm;
