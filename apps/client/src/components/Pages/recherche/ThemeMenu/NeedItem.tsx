import { GetNeedResponse } from "@refugies-info/api-types";
import { cn } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import React, { useContext } from "react";
import { ThemeMenuContext } from "~/components/Pages/recherche/ThemeMenu/ThemeMenuContext";
import { useLocale } from "~/hooks";
import styles from "./NeedItem.module.css";

interface Props {
  need?: GetNeedResponse;
  label?: string;
  count?: number | string;
}

const NeedItem: React.FC<Props> = ({ need, label, count: customCount }) => {
  const locale = useLocale();
  const { nbDispositifsByNeed } = useContext(ThemeMenuContext);
  const { t } = useTranslation();

  const displayLabel = label || (need ? need[locale]?.text || "" : "");
  const displayCount = customCount !== undefined ? customCount : need ? nbDispositifsByNeed[need._id.toString()] : "";
  const countNumber = typeof displayCount === "string" ? parseInt(displayCount, 10) || 0 : displayCount;

  return (
    <span className={cn("space-between flex w-full")}>
      <span className={styles.label}>{displayLabel}</span>{" "}
      <span
        className={cn("ms-auto", styles.count)}
        aria-label={t("Recherche.themeDispositifCount", { count: countNumber })}
      >
        {displayCount}
      </span>
    </span>
  );
};

export default NeedItem;
