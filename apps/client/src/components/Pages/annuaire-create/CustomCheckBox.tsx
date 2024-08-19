import React from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import styles from "./CustomCheckBox.module.scss";

interface Props {
  checked: boolean;
  onClick?: () => void;
}

export const CustomCheckBox = (props: Props) => (
  <div
    className={cls(styles.container, props.checked && styles.checked)}
    onClick={props.onClick}
  >
    {props.checked && <EVAIcon name="checkmark" />}
  </div>
);
