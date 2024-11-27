import { CheckboxProps, Indicator, Root } from "@radix-ui/react-checkbox";
import React from "react";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cls } from "~/lib/classname";
import styles from "./Checkbox.module.css";
import CheckboxIcon from "./CheckboxIcon";

type Props = {
  labelClassName?: string;
  onChange?: () => void;
} & Omit<CheckboxProps, "onCheckedChange">;

const Checkbox: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  checked,
  children,
  disabled,
  onChange,
  className,
  labelClassName,
}) => {
  const stylesDisabled = useStylesDisabled();

  return (
    <span className={cls(styles.container, disabled && styles.disabled, className)} id={id}>
      <Root
        className={cls(styles.root, checked === true && styles.checked)}
        checked={checked ?? false}
        onCheckedChange={onChange}
        disabled={disabled}
        tabIndex={0}
      >
        <input
          type="checkbox"
          checked={checked ? true : false}
          onChange={onChange}
          className={styles.realCheckBox}
          tabIndex={-1}
        />
        {!stylesDisabled && (
          <Indicator className={styles.indicator}>
            <CheckboxIcon />
          </Indicator>
        )}
      </Root>{" "}
      <label className={cls(styles.label, disabled && styles.disabled, labelClassName)}>{children}</label>
    </span>
  );
};

export default Checkbox;
