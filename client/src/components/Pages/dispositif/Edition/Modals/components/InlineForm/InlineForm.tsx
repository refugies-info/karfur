import { cls } from "lib/classname";
import React from "react";
import styles from "./InlineForm.module.scss";

interface Props {
  children: React.ReactNode;
  border?: boolean;
  className?: string;
}

const InlineForm = (props: Props) => {
  return <div className={cls(styles.form, props.border && styles.border, props.className)}>{props.children}</div>;
};

export default InlineForm;
