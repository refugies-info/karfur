import CheckboxIcon from "components/UI/CheckboxIcon";
import React from "react";
import styles from "./Need.module.css";

interface Props {
  label: string;
}

const Need: React.FC<Props> = ({ label }) => {
  return (
    <div className={styles.container}>
      <CheckboxIcon />
      <span className={styles.label}>{label}</span>
      <div className={styles.countContainer}>
        <div className={styles.count}>{133}</div>
      </div>
    </div>
  );
};

export default Need;
