import type { GetNeedResponse } from "@refugies-info/api-types";
import { cn } from "@refugies-info/ui";
import type React from "react";
import { useContext } from "react";
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

  const displayLabel = label || (need ? need[locale]?.text || "" : "");
  const displayCount =
    customCount !== undefined ? customCount : need ? nbDispositifsByNeed[need._id.toString()] : "";

  return (
    <span className={cn("space-between flex w-full")}>
      <span className={styles.label}>{displayLabel}</span>{" "}
      <span className={cn("ms-auto", styles.count)} aria-hidden="true">
        {displayCount}
      </span>
    </span>
  );
};

export default NeedItem;
