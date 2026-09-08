import type { GetThemeResponse } from "@refugies-info/api-types";
import useLocale from "hooks/useLocale";
import { cn } from "lib/classname";
import { useTranslation } from "next-i18next";
import type React from "react";
import { useMemo } from "react";
import styles from "./NewThemeBadge.module.scss";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  theme: GetThemeResponse | number; // theme or number for "+X" badge
}

export const NewThemeBadge = ({ theme, className, ...props }: Props) => {
  const locale = useLocale();
  const { t } = useTranslation();

  const isPlusTag = useMemo(() => typeof theme === "number", [theme]);
  const themeText = useMemo(
    () => (isPlusTag ? `+${theme}` : (theme as GetThemeResponse).short[locale] || ""),
    [isPlusTag, theme, locale],
  );
  const background = useMemo(
    () => (isPlusTag ? null : (theme as GetThemeResponse).colors.color40),
    [isPlusTag, theme],
  );

  return (
    <span
      className={cn(styles.container, className, "theme-badge")}
      style={background ? { backgroundColor: background } : undefined}
      {...props}
    >
      {themeText}
      {/* Le « +N » ne dit rien tout seul une fois vocalisé : on lui adjoint son unité,
          visuellement masquée pour ne rien décaler (RGAA 10.8). */}
      {isPlusTag && (
        <>
          {" "}
          <span className="sr-only">
            {t("ui.themeBadge", { count: theme as number, defaultValue: "autres thèmes" })}
          </span>
        </>
      )}
    </span>
  );
};
