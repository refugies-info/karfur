import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useLocale } from "hooks";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import Button from "components/UI/Button";
import Flag from "components/UI/Flag";
import SendSMSModal from "./SendSMSModal";
import ReadLanguageModal from "./ReadLanguageModal";
import styles from "./ActionButtons.module.scss";

/**
 * Floating action buttons for mobile version
 */
const ActionButtons = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const languages = useSelector(allLanguesSelector);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);

  const language = useMemo(() => languages.find((ln) => ln.i18nCode === locale), [languages, locale]);
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Button evaIcon="paper-plane-outline" iconPosition="right" onClick={() => setShowSMSModal(true)}>
          {t("Dispositif.sendBySMS")}
        </Button>
        <span className={styles.divider} />
        <Button onClick={() => setShowReadModal(true)}>
          {language?.langueLoc}
          <Flag langueCode={language?.langueCode} className="ms-2" />
        </Button>
      </div>

      <SendSMSModal show={showSMSModal} toggle={() => setShowSMSModal((o) => !o)} />
      <ReadLanguageModal show={showReadModal} toggle={() => setShowReadModal((o) => !o)} />
    </div>
  );
};

export default ActionButtons;
