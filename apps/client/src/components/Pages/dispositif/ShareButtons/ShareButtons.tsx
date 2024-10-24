import { ContentType } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import Button from "~/components/UI/Button";
import Toast from "~/components/UI/Toast";
import Tooltip from "~/components/UI/Tooltip";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import styles from "./ShareButtons.module.scss";

const ShareButtons = () => {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);

  const shareEmail = useCallback(() => {
    if (!dispositif) return;
    Event("Share", "Mail", "from dispositif sidebar");
    const mailSubject =
      dispositif?.typeContenu === ContentType.DISPOSITIF
        ? `${dispositif.titreInformatif} avec ${dispositif.titreMarque}`
        : `${dispositif.titreInformatif}`;
    const mailBody = `Voici le lien vers cette fiche : ${window.location.href}`;
    window.location.href = `mailto:?subject=${mailSubject}&body=${mailBody}`;
  }, [dispositif]);

  const [showToastLink, setShowToastLink] = useState(false);
  const copyLink = useCallback(() => {
    Event("Share", "Copy", "from dispositif sidebar");
    navigator.clipboard.writeText(window.location.href);
    setShowToastLink(true);
  }, []);

  const print = useCallback(() => {
    Event("Share", "Print", "from dispositif sidebar");
    window.print();
  }, []);

  const shareFacebook = useCallback(() => {
    Event("Share", "Facebook", "from dispositif sidebar");
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      "_blank",
      "location=yes,height=570,width=520,scrollbars=yes,status=yes",
    );
  }, []);

  const shareLinkedin = useCallback(() => {
    Event("Share", "Linkedin", "from dispositif sidebar");
    window.open(
      `https://www.linkedin.com/shareArticle/?mini=true&url=${window.location.href}`,
      "_blank",
      "location=yes,height=570,width=520,scrollbars=yes,status=yes",
    );
  }, []);

  return (
    <div className={styles.container}>
      <Button
        priority="tertiary"
        onClick={shareEmail}
        evaIcon="email-outline"
        className={styles.btn}
        id="EmailTooltip"
        title={t("Dispositif.tooltipShareEmail")}
      />
      <Tooltip target="EmailTooltip" placement="bottom">
        {t("Dispositif.tooltipShareEmail")}
      </Tooltip>

      <Button
        priority="tertiary"
        onClick={copyLink}
        evaIcon="copy-outline"
        className={styles.btn}
        id="CopyTooltip"
        title={t("Dispositif.tooltipShareCopy")}
      />
      <Tooltip target="CopyTooltip" placement="bottom">
        {t("Dispositif.tooltipShareCopy")}
      </Tooltip>

      <Button
        priority="tertiary"
        onClick={print}
        evaIcon="printer-outline"
        className={styles.btn}
        id="PrintTooltip"
        title={t("Dispositif.tooltipSharePrint")}
      />
      <Tooltip target="PrintTooltip" placement="bottom">
        {t("Dispositif.tooltipSharePrint")}
      </Tooltip>

      <Button
        priority="tertiary"
        onClick={shareFacebook}
        icon="ri-facebook-circle-line"
        className={styles.btn}
        id="FacebookTooltip"
        title={t("Dispositif.tooltipShareFacebook")}
      />
      <Tooltip target="FacebookTooltip" placement="bottom">
        {t("Dispositif.tooltipShareFacebook")}
      </Tooltip>

      <Button
        priority="tertiary"
        onClick={shareLinkedin}
        icon="ri-linkedin-box-line"
        className={styles.btn}
        id="LinkedinTooltip"
        title={t("Dispositif.tooltipShareLinkedin")}
      />
      <Tooltip target="LinkedinTooltip" placement="bottom">
        {t("Dispositif.tooltipShareLinkedin")}
      </Tooltip>

      <Toast open={showToastLink} closeCallback={() => setShowToastLink(false)}>
        {t("Dispositif.toastShareCopied")}
      </Toast>
    </div>
  );
};

export default ShareButtons;
