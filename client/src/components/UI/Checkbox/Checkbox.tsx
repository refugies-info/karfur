import { CheckboxProps, Indicator, Root } from "@radix-ui/react-checkbox";
import React from "react";
import styles from "./Checkbox.module.css";
import CheckboxIcon from "./CheckboxIcon";
import { cls } from "lib/classname";

type Props = {
  onChange?: () => void;
} & CheckboxProps;

const Checkbox: React.FC<React.PropsWithChildren<Props>> = ({ checked, children, disabled, onChange }) => {
  return (
    <div className={styles.container}>
      <Root
        className={cls(styles.root, checked === true && styles.checked)}
        checked={checked ?? false}
        defaultChecked={false}
        onCheckedChange={onChange}
        disabled={disabled}
      >
        <Indicator className={styles.indicator}>
          <CheckboxIcon />
        </Indicator>
      </Root>
      <label className={styles.label}>{children}</label>
    </div>
  );
};

export default Checkbox;
