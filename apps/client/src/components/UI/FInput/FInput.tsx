import EVAIcon from "@/components/UI/EVAIcon/EVAIcon";
import { cls } from "@/lib/classname";
import { colors } from "@/utils/colors";
import React from "react";
import { Input, InputGroup, InputGroupText } from "reactstrap";
import { InputType } from "reactstrap/types/lib/Input";
import styles from "./FInput.module.scss";

interface Props {
  id: string;
  value?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  newSize?: boolean;
  height?: number;
  padding?: number;
  rows?: any;
  type?: InputType;
  prepend?: boolean;
  append?: boolean;
  prependName?: string;
  appendName?: string;
  prependFill?: string;
  appendFill?: string;
  autoFocus?: boolean;
  onAppendClick?: React.MouseEventHandler<HTMLElement>;
  error?: boolean;
  errorIcon?: string;
  errorType?: string;
  name?: string;
  maxlength?: number;
}

const FInput = (props: Props) => {
  const autoFocus = props.autoFocus === false ? false : true;
  return (
    <InputGroup className={cls(styles.input, "mb-2", props.className || "")}>
      {props.prepend && (
        <InputGroupText className={styles.prepend}>
          {!props.error ? (
            <EVAIcon name={props.prependName} fill={props.prependFill || colors.gray90} />
          ) : (
            <EVAIcon name={props.errorIcon || props.prependName} fill="#F44336" />
          )}
        </InputGroupText>
      )}
      <Input
        autoFocus={autoFocus}
        id={props.id}
        rows={props.rows}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        readOnly={!props.onChange}
        autoComplete={props.autoComplete}
        disabled={props.disabled}
        name={props.name}
        maxLength={props.maxlength || undefined}
        className={cls(
          props.inputClassName || "",
          !!props.prepend && styles.has_prepend,
          !!props.newSize && styles.new_size,
          !!props.error && styles.error,
        )}
        style={
          props.inputClassName === "password-input" && props.value
            ? { width: props.value.length * 10 }
            : props.height && props.padding
              ? { height: props.height, padding: props.padding }
              : {}
        }
      />
      {(props.append || props.error) && (
        <InputGroupText className={styles.append} onClick={props.onAppendClick}>
          {props.error && props.errorType !== "wrongPassword" ? (
            <EVAIcon name="alert-triangle" fill="#F44336" />
          ) : (
            <EVAIcon name={props.appendName} fill={props.appendFill || colors.gray90} />
          )}
        </InputGroupText>
      )}
    </InputGroup>
  );
};

export default FInput;
