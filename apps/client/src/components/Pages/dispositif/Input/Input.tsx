import { fr } from "@codegouvfr/react-dsfr";
import type React from "react";
import { forwardRef } from "react";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { cls } from "~/lib/classname";
import styles from "./Input.module.scss";

interface Props {
  id: string;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  label?: string;
  description?: string;
  icon?: string;
  className?: string;
  error?: string | null;
  valid?: boolean;
  value?: string;
  reset?: () => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  autoComplete?: string;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>((props, ref) => {
  return (
    <div
      className={cls(
        styles.container,
        props.valid && styles.valid,
        !!props.error && styles.error,
        props.className,
      )}
    >
      {props.label && (
        <label htmlFor={props.id}>
          {props.label}
          {props.description && <span className="fr-hint-text">{props.description}</span>}
        </label>
      )}
      <div className={cls(styles.wrapper, props.icon && styles.with_icon)}>
        {props.type === "textarea" ? (
          <textarea
            id={props.id}
            placeholder={props.placeholder}
            className={cls(styles.input)}
            value={props.value || ""}
            onChange={props.onChange}
            onFocus={props.onFocus}
            ref={ref as React.Ref<HTMLTextAreaElement>}
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
            autoComplete={props.autoComplete}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        )}
        {props.icon && (
          <EVAIcon
            name={props.icon}
            fill={
              !props.value
                ? fr.colors.decisions.text.mention.grey.default
                : fr.colors.decisions.text.actionHigh.grey.default
            }
            size={20}
            className={cls(styles.icon, styles.prepend)}
          />
        )}
        {props.error && (
          <EVAIcon
            name="alert-circle"
            fill={fr.colors.decisions.background.actionHigh.error.default}
            size={24}
            className={cls(styles.icon, styles.append)}
          />
        )}
        {props.valid && !props.error && (
          <EVAIcon
            name="checkmark-circle-2"
            fill={fr.colors.decisions.background.actionHigh.success.default}
            size={20}
            className={cls(styles.icon, styles.append)}
            ariaLabel="Champ valide"
          />
        )}
        {props.reset && props.value && (
          <div className={styles.empty_btn}>
            <EVAIcon
              name="close-outline"
              fill="dark"
              onClick={props.reset}
              size={20}
              ariaLabel="Effacer le champ"
            />
          </div>
        )}
      </div>
      {props.error && <div className={styles.error_msg}>{props.error}</div>}
    </div>
  );
});

export default Input;
