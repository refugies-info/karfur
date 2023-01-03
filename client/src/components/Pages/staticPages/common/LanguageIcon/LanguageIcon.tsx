import { cls } from "lib/classname";
import Image from "next/legacy/image";
import React, { ReactElement } from "react";
import styles from "./LanguageIcon.module.scss";

interface Props {
  language: string;
  size?: number;
  color?: "red";
}

const LanguageIcon = (props: Props) => {
  return (
    <div
      className={cls(styles.container, props.color && styles[props.color])}
      style={{
        width: props.size || 40,
        height: props.size || 40
      }}
    >
      <span className={cls(styles.flag, "fi fi-" + props.language)} title={props.language} />
    </div>
  );
};

export default LanguageIcon;
