import React from "react";
import { cls } from "lib/classname";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./AddContentButton.module.scss";

interface Props {
  children: string | React.ReactNode;
  onClick: () => void;
  size?: "md" | "lg" | "xl";
  className?: string;
}

const AddContentButton = (props: Props) => {
  return (
    <Button
      tertiary
      className={cls(styles.btn, props.size && styles[props.size], props.className)}
      onClick={props.onClick}
    >
      <span>{props.children}</span>
      <EVAIcon name="plus-circle-outline" size={24} fill={styles.lightTextMentionGrey} className={styles.icon} />
    </Button>
  );
};

export default AddContentButton;
