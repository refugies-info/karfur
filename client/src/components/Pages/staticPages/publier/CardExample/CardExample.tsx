import React from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import styles from "./CardExample.module.scss";

interface Props {
  exampleOk: string;
  exampleKo: string;
}

const CardExample = (props: Props) => {
  return (
    <div>
      <p className={cls(styles.example, styles.example_ko)}>
        <EVAIcon name="close-outline" size={20} fill={styles.colorKo} className={styles.icon} />
        {props.exampleKo}
      </p>
      <p className={cls(styles.example, styles.example_ok)}>
        <EVAIcon name="checkmark-outline" size={20} fill={styles.colorOk} className={styles.icon} />
        {props.exampleOk}
      </p>
    </div>
  );
};

export default CardExample;
