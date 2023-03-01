import React from "react";
import Button from "components/UI/Button";
import styles from "./SectionButtons.module.scss";

const SectionButtons = () => {
  return (
    <div className={styles.container}>
      <Button tertiary icon="play-circle-outline" className={styles.btn} />
      <Button tertiary icon="message-circle-outline" className={styles.btn} />
    </div>
  );
};

export default SectionButtons;
