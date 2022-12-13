import React from "react";
import { cls } from "lib/classname";
import EVAIcon from "../EVAIcon/EVAIcon";
import styles from "./Warning.module.scss";

interface Props {
  text: string;
  color: "purple" | "red" | "orange";
  icon?: string;
}

const Warning = (props: Props) => {
  return (
    <div className={cls(styles.container, styles[props.color])}>
      <EVAIcon name={props.icon || "question-mark-circle-outline"} size={24} fill="dark" />
      <p className={styles.text}>{props.text}</p>
    </div>
  );
};

export default Warning;
