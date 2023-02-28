import React from "react";
import Button from "components/UI/Button";
import styles from "./ShareButtons.module.scss";

const ShareButtons = () => {
  return (
    <div className={styles.container}>
      <Button tertiary icon="email-outline" className={styles.btn} />
      <Button tertiary icon="copy-outline" className={styles.btn} />
      <Button tertiary icon="printer-outline" className={styles.btn} />
      <Button tertiary icon="facebook-outline" className={styles.btn} />
    </div>
  );
};

export default ShareButtons;
