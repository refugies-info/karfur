import React from "react";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import TextExample from "./TextExample";
import styles from "./TextExampleLine.module.scss";

interface Props {
  successText: string;
  errorText: string;
  fullHeight?: boolean;
}

const TextExampleLine = (props: Props) => {
  return (
    <div className={cls(styles.container, props.fullHeight && styles.fill)}>
      <TextExample text={props.errorText} type="error" />
      <EVAIcon name="arrow-forward-outline" size={16} className="mx-2" fill="dark" />
      <TextExample text={props.successText} type="success" />
    </div>
  );
};

export default TextExampleLine;
