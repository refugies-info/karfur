import React from "react";
import useLocale from "hooks/useLocale";
import styles from "./ThemeBadge.module.scss";
import ThemeIcon from "../ThemeIcon";
import { cls } from "lib/classname";
import { GetThemeResponse } from "@refugies-info/api-types";

interface Props {
  theme: GetThemeResponse;
  style?: any;
  className?: any;
}

const ThemeBadge = (props: Props) => {
  const locale = useLocale();

  return (
    <div
      className={cls(styles.container, props.className, "theme-badge")}
      style={{ backgroundColor: props.theme.colors.color30, ...(props.style || {}) }}
    >
      <span className={styles.icon}>
        <ThemeIcon theme={props.theme} size={12} color={props.theme.colors.color100} />
      </span>
      <span style={{ color: props.theme.colors.color100 }}>{props.theme.short[locale] || ""}</span>
    </div>
  );
};

export default ThemeBadge;
