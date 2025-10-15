import { GetNeedResponse } from "@refugies-info/api-types";
import { cn } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { ThemeMenuContext } from "~/components/Pages/recherche/ThemeMenu/ThemeMenuContext";
import { useLocale } from "~/hooks";
import { themesSelector } from "~/services/Themes/themes.selectors";
import styles from "./NeedItem.module.css";

interface Props {
  need?: GetNeedResponse;
  label?: string;
  count?: number | string;
}

const NeedItem: React.FC<Props> = ({ need, label, count: customCount }) => {
  const locale = useLocale();
  const { nbDispositifsByNeed, selectedThemeId } = useContext(ThemeMenuContext);
  const { t } = useTranslation();
  const themes = useSelector(themesSelector);

  const displayLabel = label || (need ? need[locale]?.text || "" : "");
  const displayCount = customCount !== undefined ? customCount : need ? nbDispositifsByNeed[need._id.toString()] : "";
  const countNumber = typeof displayCount === "string" ? parseInt(displayCount, 10) || 0 : displayCount;

  const selectedTheme = themes.find((theme) => theme._id === selectedThemeId);
  const themeName = selectedTheme?.short?.[locale] || selectedTheme?.name?.[locale] || "";

  const ariaLabel =
    displayLabel === "Tous"
      ? t("Recherche.needAllSheets", { count: countNumber, theme: themeName })
      : `${displayLabel} ${t("Recherche.needSheetsCount", { count: countNumber })}`;

  return (
    <span className={cn("space-between flex w-full")} aria-label={ariaLabel}>
      <span className={styles.label}>{displayLabel}</span>{" "}
      <span className={cn("ms-auto", styles.count)}>{displayCount}</span>
    </span>
  );
};

export default NeedItem;
