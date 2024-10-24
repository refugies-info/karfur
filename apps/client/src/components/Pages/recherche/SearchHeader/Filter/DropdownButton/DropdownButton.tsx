import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";

import { useTranslation } from "next-i18next";
import React from "react";
import Balancer from "react-wrap-balancer";
import { cls } from "~/lib/classname";
import styles from "./DropdownButton.module.scss";

interface Props extends DropdownMenu.DropdownMenuTriggerProps {
  label: string;
  icon?: string;
  value: string[];
  onClick?: () => void;
  isOpen: boolean;
  onClear: () => void;
  count?: number | null;
  tooltip?: { trigger: string; text: string } | null | undefined;
}

export const DropdownButton = React.forwardRef<HTMLButtonElement, Props>(function DropdownButton(
  { label, tooltip, icon, count, value, onClick, isOpen, onClear, ...other },
  forwardedRef: React.Ref<HTMLButtonElement>,
) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <button
        onClick={onClick}
        className={cls(styles.button, isOpen && styles.open, value.length > 0 && !icon && styles.values)}
        ref={forwardedRef}
        {...other}
      >
        {count && count > 0 ? <span className={styles.count}>{count}</span> : null}

        {icon ? (
          <i className={icon}></i>
        ) : (
          value[0] && <span className={cls(styles.label, styles.limitedWidth)}>{label}</span>
        )}

        {tooltip && (
          <Tooltip.Root>
            <Tooltip.Portal>
              <Tooltip.TooltipContent className={styles.tooltip} side="bottom" align="start" sideOffset={15}>
                <Balancer>{tooltip.text}</Balancer>
              </Tooltip.TooltipContent>
            </Tooltip.Portal>

            <Tooltip.Trigger asChild>
              <span tabIndex={0}>{tooltip.trigger}</span>
            </Tooltip.Trigger>
          </Tooltip.Root>
        )}

        {!icon && value.length > 1 && (
          <span className={styles.plus}>
            <span>+</span> {value.length - 1}
          </span>
        )}
        {!icon && value.length === 0 && !icon && (
          <>
            <span className={cls(styles.label)}>{label}</span>{" "}
            <i className={isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
          </>
        )}
      </button>

      {!icon && value.length > 0 && (
        <button className={styles.clear} onClick={onClear} title={t("Recherche.resetButton")}>
          <i className="ri-close-circle-fill"></i>
        </button>
      )}
    </div>
  );
});
