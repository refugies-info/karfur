import { GetThemeResponse } from "@refugies-info/api-types";
import useLocale from "hooks/useLocale";
import { cls } from "lib/classname";
import { useMemo } from "react";
import styles from "./NewThemeBadge.module.scss";

interface Props {
  theme: GetThemeResponse | number; // theme or number for "+X" badge
  className?: any;
}

export const NewThemeBadge = (props: Props) => {
  const locale = useLocale();

  const isPlusTag = useMemo(() => typeof props.theme === "number", [props.theme]);
  const themeText = useMemo(
    () => (isPlusTag ? `+${props.theme}` : (props.theme as GetThemeResponse).short[locale] || ""),
    [isPlusTag, props.theme, locale],
  );
  const background = useMemo(
    () => (isPlusTag ? null : (props.theme as GetThemeResponse).colors.color40),
    [isPlusTag, props.theme],
  );

  return (
    <div
      className={cls(styles.container, props.className, "theme-badge")}
      style={background ? { backgroundColor: background } : undefined}
    >
      {themeText}
    </div>
  );
};
