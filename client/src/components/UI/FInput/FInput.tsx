import React from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import styles from "./FInput.module.scss";
import { InputType } from "reactstrap/lib/Input";
import { cls } from "lib/classname";

interface Props {
  id: string;
  value?: string;
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  autoComplete?: string;
  disabled?: boolean;
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
  name?: string
}

const FInput = (props: Props) => {
  const autoFocus = props.autoFocus === false ? false : true;
  return (
    <InputGroup className={styles.input + " mb-10"}>
      {props.prepend && (
        <InputGroupAddon
          addonType="prepend"
          className={styles.prepend}
        >
          {!props.error ? (
            <EVAIcon
              name={props.prependName}
              fill={props.prependFill || colors.gray90}
            />
          ) : (
            <EVAIcon
              name={props.errorIcon || props.prependName}
              fill="#F44336"
            />
          )}
        </InputGroupAddon>
      )}
      <Input
        autoFocus={autoFocus}
        id={props.id}
        rows={props.rows}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        autoComplete={props.autoComplete}
        disabled={props.disabled}
        name={props.name}
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
        <InputGroupAddon
          addonType="append"
          className={styles.append}
          onClick={props.onAppendClick}
        >
          {props.error && props.errorType !== "wrongPassword" ? (
            <EVAIcon name="alert-triangle" fill="#F44336" />
          ) : (
            <EVAIcon
              name={props.appendName}
              fill={props.appendFill || colors.gray90}
            />
          )}
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

export default FInput;
