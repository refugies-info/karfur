import React from "react";
import styles from "./InlineForm.module.scss";

interface Props {
  children: React.ReactNode;
}

const InlineForm = (props: Props) => {
  return <div className={styles.form}>{props.children}</div>;
};

export default InlineForm;
