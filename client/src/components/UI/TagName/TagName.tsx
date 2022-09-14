import React from "react";
import { Theme } from "types/interface";
import styles from "./TagName.module.scss";
import ThemeIcon from "../ThemeIcon";

interface Props {
  theme: Theme
  colored?: boolean
  size?: number
}

const TagName = (props: Props) => (
  <div
    className={styles.container}
    style={props.colored ? { color: props.theme.colors.color100 } : {}}
  >
    <span className={styles.icon}>
      <ThemeIcon
        theme={props.theme}
        color={props.colored ? props.theme.colors.color100 : undefined}
        size={props.size}
      />
    </span>
    <span>{props.theme.short.fr}</span>
  </div>
);


export default TagName;
