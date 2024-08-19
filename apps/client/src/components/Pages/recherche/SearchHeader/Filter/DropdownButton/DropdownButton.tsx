import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cls } from "lib/classname";
import { useTranslation } from "next-i18next";
import React from "react";
import styles from "./DropdownButton.module.scss";

interface Props extends DropdownMenu.DropdownMenuTriggerProps {
  label: string;
  value: string[];
  onClick: () => void;
  isOpen: boolean;
  onClear: () => void;
}

export const DropdownButton = React.forwardRef<HTMLButtonElement, Props>(function DropdownButton(
  { label, value, onClick, isOpen, onClear, ...other },
  forwardedRef: React.Ref<HTMLButtonElement>,
) {
  const { t } = useTranslation();
  return (
    <span className={styles.container}>
      <button
        onClick={onClick}
        className={cls(styles.button, isOpen && styles.open, value.length > 0 && styles.values)}
        ref={forwardedRef}
        {...other}
      >
        {value[0] || label}
        {value.length > 1 && (
          <span className={styles.plus}>
            <span>+</span> {value.length - 1}
          </span>
        )}
        {value.length === 0 && <i className={isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>}
      </button>

      {value.length > 0 && (
        <button className={styles.clear} onClick={onClear} title={t("Recherche.resetButton")}>
          <i className="ri-close-circle-fill"></i>
        </button>
      )}
    </span>
  );
});
