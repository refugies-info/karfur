import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./ZeroCountTooltip.module.scss";

interface Props {
  active: boolean;
}

const ZeroCountTooltip: React.FC<React.PropsWithChildren<Props>> = ({ active, children }) => {
  const { t } = useTranslation();

  return active ? (
    <Tooltip.Root>
      <Tooltip.Portal>
        <Tooltip.TooltipContent className={styles.tooltip}>
          {t("Recherche.tooltipAucuneFicheCorrespondante")}
        </Tooltip.TooltipContent>
      </Tooltip.Portal>
      <Tooltip.Trigger className={styles.trigger}>{children}</Tooltip.Trigger>
    </Tooltip.Root>
  ) : (
    <>{children}</>
  );
};

export default ZeroCountTooltip;
