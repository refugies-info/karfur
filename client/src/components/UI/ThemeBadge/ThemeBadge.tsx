import React from "react";
import { Theme } from "types/interface";
import styles from "./ThemeBadge.module.scss";
import ThemeIcon from "../ThemeIcon";
import { cls } from "lib/classname";

interface Props {
  theme: Theme;
  style?: any;
  className?: any;
}

const ThemeBadge = (props: Props) => (
  <div
    className={cls(styles.container, props.className, "theme-badge")}
    style={{ backgroundColor: props.theme.colors.color30, ...(props.style || {}) }}
  >
    <span className={styles.icon}>
      <ThemeIcon theme={props.theme} size={12} color={props.theme.colors.color100} />
    </span>
    <span style={{ color: props.theme.colors.color100 }}>{props.theme.short.fr}</span>
  </div>
);

export default ThemeBadge;
