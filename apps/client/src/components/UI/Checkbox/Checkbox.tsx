import { CheckboxProps, Indicator, Root } from "@radix-ui/react-checkbox";
import React from "react";
import { cls } from "~/lib/classname";
import styles from "./Checkbox.module.css";
import CheckboxIcon from "./CheckboxIcon";

type Props = {
  onChange?: () => void;
} & Omit<CheckboxProps, "onCheckedChange">;

const Checkbox: React.FC<React.PropsWithChildren<Props>> = ({ id, checked, children, disabled, onChange }) => {
  return (
    <div className={cls(styles.container, disabled && styles.disabled)} id={id}>
      <Root
        className={cls(styles.root, checked === true && styles.checked)}
        checked={checked ?? false}
        onCheckedChange={onChange}
        disabled={disabled}
      >
        <Indicator className={styles.indicator}>
          <CheckboxIcon />
        </Indicator>
      </Root>
      <label className={cls(styles.label, disabled && styles.disabled)}>{children}</label>
    </div>
  );
};

export default Checkbox;
