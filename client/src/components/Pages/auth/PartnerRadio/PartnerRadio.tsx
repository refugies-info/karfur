import { fr } from "@codegouvfr/react-dsfr";
import { cls } from "lib/classname";
import React, { useId, memo, forwardRef, type ReactNode, type ComponentProps } from "react";
import styles from "./PartnerRadio.module.scss";

// adapted copy of https://github.com/codegouvfr/react-dsfr/blob/main/src/shared/Fieldset.tsx
export type FieldsetProps = {
  className?: string;
  id: string;
  classes?: Partial<Record<"root" | "legend" | "content", string>>;
  hintText?: ReactNode;
  state?: "success" | "error" | "default";
  stateRelatedMessage?: ReactNode;
  disabled?: boolean;
  name?: string;
  options: {
    label: ReactNode;
    hintText?: ReactNode;
    nativeInputProps: ComponentProps<"input">;
    illustration: ReactNode;
    fullWidth?: boolean;
  }[];
};

const PartnerRadio = memo(
  forwardRef<HTMLFieldSetElement, FieldsetProps>((props, ref) => {
    const {
      className,
      id: id_props,
      classes = {},
      hintText,
      options,
      state = "default",
      stateRelatedMessage,
      disabled = false,
      name: name_props,
      ...rest
    } = props;

    const id = props.id;
    const getInputId = (i: number) => `${id}-${i}`;
    const errorDescId = `${id}-desc-error`;
    const successDescId = `${id}-desc-valid`;
    const messagesWrapperId = `${id}-messages`;

    const radioName = (function useClosure() {
      const id = useId();

      return name_props ?? `radio-name-${id}`;
    })();

    return (
      <fieldset
        id={id}
        className={cls(
          fr.cx(
            "fr-fieldset",
            (() => {
              switch (state) {
                case "default":
                  return undefined;
                case "error":
                  return "fr-fieldset--error";
                case "success":
                  return "fr-fieldset--valid";
              }
            })(),
          ),
          classes.root,
          className,
        )}
        disabled={disabled}
        aria-labelledby={cls(messagesWrapperId)}
        role={state === "default" ? undefined : "group"}
        {...rest}
        ref={ref}
      >
        <div className={cls(fr.cx("fr-fieldset__content"), classes.content, styles.container)}>
          {options.map(({ label, hintText, nativeInputProps, fullWidth, ...rest }, i) => (
            <div
              className={cls(
                fr.cx("fr-radio-group", "fr-radio-rich"),
                !fullWidth && styles.radio,
                fullWidth && styles.full,
              )}
              key={i}
            >
              {!fullWidth && "illustration" in rest && <div className={styles.illu}>{rest.illustration}</div>}
              <input type="radio" id={getInputId(i)} name={radioName} {...nativeInputProps} />
              <label className={styles.label} htmlFor={getInputId(i)}>
                {label}
                {hintText !== undefined && <span className={fr.cx("fr-hint-text")}>{hintText}</span>}
              </label>
              {fullWidth && "illustration" in rest && (
                <div className={cls(fr.cx("fr-radio-rich__img"), styles.illu)}>{rest.illustration}</div>
              )}
            </div>
          ))}
        </div>
        <div className={fr.cx("fr-messages-group")} id={messagesWrapperId} aria-live="assertive">
          {stateRelatedMessage !== undefined && (
            <p
              id={(() => {
                switch (state) {
                  case "error":
                    return errorDescId;
                  case "success":
                    return successDescId;
                  default:
                    return "";
                }
              })()}
              className={fr.cx(
                "fr-message",
                (() => {
                  switch (state) {
                    case "error":
                      return "fr-message--error";
                    case "success":
                      return "fr-message--valid";
                    default:
                      return null;
                  }
                })(),
              )}
            >
              {stateRelatedMessage}
            </p>
          )}
        </div>
      </fieldset>
    );
  }),
);

export default PartnerRadio;
