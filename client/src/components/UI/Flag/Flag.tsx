import React from "react";
import { cls } from "lib/classname";
import styles from "./Flag.module.scss";

interface Props {
  langueCode: string | undefined;
  className?: string;
}

const Flag = (props: Props) =>
  props.langueCode ? (
    <span className={cls(styles.flag, `fi fi-${props.langueCode}`, props.className)} title={props.langueCode} />
  ) : null;
export default Flag;
