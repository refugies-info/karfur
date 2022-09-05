import React from "react";
import { Theme } from "types/interface";
import styles from "./TagName.module.scss";
import ThemeIcon from "../ThemeIcon";

interface Props {
  theme: Theme
}

const TagName = (props: Props) => (
  <div className={styles.container}>
    <span className={styles.icon}>
      <ThemeIcon theme={props.theme} />
    </span>
    <span>{props.theme.short.fr}</span>
  </div>
);


export default TagName;
