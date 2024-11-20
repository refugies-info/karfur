import { CheckboxProps, Indicator, Root } from "@radix-ui/react-checkbox";
import React from "react";
import { cls } from "~/lib/classname";
import styles from "./Checkbox.module.css";
import CheckboxIcon from "./CheckboxIcon";

type Props = {
  onChange?: () => void;
} & Omit<CheckboxProps, "onCheckedChange">;

const Checkbox: React.FC<React.PropsWithChildren<Props>> = ({ id, checked, children, disabled, onChange }) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 11)}`;
  const handleLabelClick = (e: React.MouseEvent) => {
    // Prevent triggering twice if clicking on the Root component
    if ((e.target as HTMLElement).closest('[role="checkbox"]')) return;
    onChange?.();
  };

  return (
    <div className={cls(styles.container, disabled && styles.disabled)} id={id}>
      <Root
        id={checkboxId}
        className={cls(styles.root, checked === true && styles.checked)}
        checked={checked ?? false}
        onCheckedChange={onChange}
        disabled={disabled}
      >
        <Indicator className={styles.indicator}>
          <CheckboxIcon />
        </Indicator>
      </Root>
      <span
        className={cls(styles.label, disabled && styles.disabled)}
        onClick={disabled ? undefined : handleLabelClick}
      >
        {children}
      </span>
    </div>
  );
};

export default Checkbox;
