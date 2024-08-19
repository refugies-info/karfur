import React from "react";
import { cls } from "lib/classname";
import EVAIcon from "../EVAIcon/EVAIcon";
import styles from "./Input.module.scss";
import { colors } from "colors";

interface Props {
  type?: "text" | "email";
  placeholder?: string;
  icon?: string;
  className?: string;
  error?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const CustomInput = (props: Props) => {
  return (
    <div>
      <div
        className={cls(styles.container, props.icon && styles.with_icon, props.error && styles.error, props.className)}
      >
        {props.icon && (
          <EVAIcon name={props.icon} fill={colors.gray80} size={24} className={cls(styles.icon, styles.prepend)} />
        )}
        <input
          type={props.type || "text"}
          placeholder={props.placeholder}
          className={styles.input}
          value={props.value}
          onChange={props.onChange}
        />
        {props.error && (
          <EVAIcon
            name="alert-triangle"
            fill={colors.gray80}
            size={24}
            className={cls(styles.icon, styles.append, "input-error-icon")}
          />
        )}
      </div>
      {props.error && <div className={styles.error_msg}>{props.error}</div>}
    </div>
  );
};

export default CustomInput;
