import React from "react";
import useLocale from "hooks/useLocale";
import styles from "./TagName.module.scss";
import ThemeIcon from "../ThemeIcon";
import { GetThemeResponse } from "api-types";

interface Props {
  theme: GetThemeResponse;
  colored?: boolean;
  size?: number;
}

const TagName = (props: Props) => {
  const locale = useLocale();

  return (
    <div className={styles.container} style={props.colored ? { color: props.theme.colors.color100 } : {}}>
      <span className={styles.icon}>
        <ThemeIcon
          theme={props.theme}
          color={props.colored ? props.theme.colors.color100 : undefined}
          size={props.size}
        />
      </span>
      <span className={styles.name} style={props.size ? { minHeight: props.size } : {}}>
        {props.theme.short[locale] || ""}
      </span>
    </div>
  );
};

export default TagName;
