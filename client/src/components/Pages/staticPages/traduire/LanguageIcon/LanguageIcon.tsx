import { cls } from "lib/classname";
import Image from "next/legacy/image";
import React, { ReactElement } from "react";
import styles from "./LanguageIcon.module.scss";

interface Props {
  language: string;
  size?: number;
}

const LanguageIcon = (props: Props) => {
  return (
    <div
      className={cls(styles.container)}
      style={{
        width: props.size || 40,
        height: props.size || 40
      }}
    >
      <i className={cls(styles.flag, "flag-icon flag-icon-" + props.language)} title={props.language} />
    </div>
  );
};

export default LanguageIcon;
