import React, { useState } from "react";
import Button from "components/UI/Button";
import styles from "./ShareButtons.module.scss";
import { Event } from "lib/tracking";
import { useSelector } from "react-redux";
import { ContentType } from "api-types";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Toast from "components/UI/Toast";

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
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank");
  };

  return (
    <div className={styles.container}>
      <Button tertiary onClick={shareEmail} icon="email-outline" className={styles.btn} />
      <Button tertiary onClick={copyLink} icon="copy-outline" className={styles.btn} />
      <Button tertiary onClick={print} icon="printer-outline" className={styles.btn} />
      <Button tertiary onClick={shareFacebook} icon="facebook-outline" className={styles.btn} />

      {showToastLink && <Toast close={() => setShowToastLink(false)}>Lien copié !</Toast>}
    </div>
  );
};

export default ShareButtons;
