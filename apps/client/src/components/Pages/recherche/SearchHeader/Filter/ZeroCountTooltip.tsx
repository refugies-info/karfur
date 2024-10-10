import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";
import styles from "./ZeroCountTooltip.module.scss";

interface Props {
  active: boolean;
}

const ZeroCountTooltip: React.FC<React.PropsWithChildren<Props>> = ({ active, children }) => {
  return active ? (
    <Tooltip.Root>
      <Tooltip.Portal>
        <Tooltip.TooltipContent className={styles.tooltip}>
          Aucune fiche ne correspond à ce critère. Ajustez vos autres filtres pour filtrer sur ce critère spécifique.
        </Tooltip.TooltipContent>
      </Tooltip.Portal>
      <Tooltip.Trigger className={styles.trigger}>{children}</Tooltip.Trigger>
    </Tooltip.Root>
  ) : (
    <>{children}</>
  );
};

export default ZeroCountTooltip;
