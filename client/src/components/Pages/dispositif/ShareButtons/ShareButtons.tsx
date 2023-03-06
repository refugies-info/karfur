import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ContentType } from "api-types";
import { Event } from "lib/tracking";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import Toast from "components/UI/Toast";
import Tooltip from "components/UI/Tooltip";
import styles from "./ShareButtons.module.scss";

const ShareButtons = () => {
  const dispositif = useSelector(selectedDispositifSelector);

  const shareEmail = () => {
    if (!dispositif) return;
    Event("Share", "Mail", "from dispositif sidebar");
    const mailSubject =
      dispositif?.typeContenu === ContentType.DISPOSITIF
        ? `${dispositif.titreInformatif} avec ${dispositif.titreMarque}`
        : `${dispositif.titreInformatif}`;
    const mailBody = `Voici le lien vers cette fiche : ${window.location.href}`;
    window.location.href = `mailto:?subject=${mailSubject}&body=${mailBody}`;
  };
  const [showToastLink, setShowToastLink] = useState(false);
  const copyLink = () => {
    Event("Share", "Copy", "from dispositif sidebar");
    navigator.clipboard.writeText(window.location.href);
    setShowToastLink(true);
  };
  const print = () => {
    Event("Share", "Print", "from dispositif sidebar");
    window.print();
  };
  const shareFacebook = () => {
    Event("Share", "Facebook", "from dispositif sidebar");
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      "_blank",
      "location=yes,height=570,width=520,scrollbars=yes,status=yes",
    );
  };
  const shareLinkedin = () => {
    Event("Share", "Linkedin", "from dispositif sidebar");
    window.open(
      `https://www.linkedin.com/shareArticle/?mini=true&url=${window.location.href}`,
      "_blank",
      "location=yes,height=570,width=520,scrollbars=yes,status=yes",
    );
  };

  return (
    <div className={styles.container}>
      <Button tertiary onClick={shareEmail} icon="email-outline" className={styles.btn} id="EmailTooltip" />
      <Tooltip target="EmailTooltip" placement="bottom">
        Envoyer par email
      </Tooltip>

      <Button tertiary onClick={copyLink} icon="copy-outline" className={styles.btn} id="CopyTooltip" />
      <Tooltip target="CopyTooltip" placement="bottom">
        Copier le lien de la fiche
      </Tooltip>

      <Button tertiary onClick={print} icon="printer-outline" className={styles.btn} id="PrintTooltip" />
      <Tooltip target="PrintTooltip" placement="bottom">
        Imprimer
      </Tooltip>

      <Button tertiary onClick={shareFacebook} icon="ri-facebook-circle-line" className={styles.btn} />
      <Button tertiary onClick={shareLinkedin} icon="ri-linkedin-box-line" className={styles.btn} />

      {showToastLink && <Toast close={() => setShowToastLink(false)}>Lien copié !</Toast>}
    </div>
  );
};

export default ShareButtons;
