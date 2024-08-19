import React from "react";
import { cls } from "lib/classname";
import styles from "./Warning.module.scss";

interface Props {
  text: string;
  color: "purple" | "red" | "orange";
}

const Warning = (props: Props) => {
  return (
    <div className={cls(styles.container, styles[props.color])}>
      <p className={styles.text}>{props.text}</p>
    </div>
  );
};

export default Warning;
