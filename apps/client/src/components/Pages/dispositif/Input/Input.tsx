import React from "react";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./Input.module.scss";

interface Props {
  id: string;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  label?: string;
  icon?: string;
  className?: string;
  error?: string | null;
  valid?: boolean;
  value?: string;
  reset?: () => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const Input = (props: Props) => {
  return (
    <div className={cls(styles.container, props.valid && styles.valid, !!props.error && styles.error, props.className)}>
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      <div className={cls(styles.wrapper, props.icon && styles.with_icon)}>
        {props.type === "textarea" ? (
          <textarea
            id={props.id}
            placeholder={props.placeholder}
            className={cls(styles.input)}
            value={props.value || ""}
            onChange={props.onChange}
            onFocus={props.onFocus}
          />
        ) : (
          <input
            id={props.id}
            type={props.type || "text"}
            placeholder={props.placeholder}
            className={styles.input}
            value={props.value || ""}
            onChange={props.onChange}
            onFocus={props.onFocus}
          />
        )}
        {props.icon && (
          <EVAIcon
            name={props.icon}
            fill={!props.value ? styles.lightTextMentionGrey : styles.lightTextTitleGrey}
            size={20}
            className={cls(styles.icon, styles.prepend)}
          />
        )}
        {props.error && (
          <EVAIcon
            name="alert-circle"
            fill={styles.lightTextDefaultError}
            size={24}
            className={cls(styles.icon, styles.append)}
          />
        )}
        {props.valid && !props.error && (
          <EVAIcon
            name="checkmark-circle-2"
            fill={styles.lightTextDefaultSuccess}
            size={20}
            className={cls(styles.icon, styles.append)}
          />
        )}
        {props.reset && props.value && (
          <div className={styles.empty_btn}>
            <EVAIcon name="close-outline" fill="dark" onClick={props.reset} size={20} />
          </div>
        )}
      </div>
      {props.error && <div className={styles.error_msg}>{props.error}</div>}
    </div>
  );
};

export default Input;
