import Checkbox from "components/UI/Checkbox";
import React from "react";
import styles from "./Need.module.css";

interface Props {
  label: string;
}

const Need: React.FC<Props> = ({ label }) => {
  return (
    <Checkbox>
      <span className={styles.label}>{label}</span>
      <div className={styles.countContainer}>
        <div className={styles.count}>{133}</div>
      </div>
    </Checkbox>
  );
};

export default Need;
