import React from "react";

import { Input, InputGroup, InputGroupAddon } from "reactstrap";

import EVAIcon from "../../UI/EVAIcon/EVAIcon";

import "./FInput.scss";
import { colors } from "colors";

const FInput = (props) => {
  const autoFocus = props.autoFocus === false ? false : true;
  if (!props.error) {
    return (
      <InputGroup className="mb-10 figma-input-group">
        {props.prepend && (
          <InputGroupAddon addonType="prepend" className="icon-prepend">
            <EVAIcon
              name={props.prependName}
              fill={props.prependFill || colors.noir}
            />
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
          className={[
            props.inputClassName,
            props.prepend ? "has-prepend" : "",
            props.newSize ? "new-size" : "",
          ].join(" ")}
          style={
            props.inputClassName === "password-input" && props.value
              ? { width: props.value.length * 10 }
              : props.height && props.padding
              ? { height: props.height, padding: props.padding }
              : null
          }
        />
        {props.append && (
          <InputGroupAddon
            addonType="append"
            className="icon-append"
            onClick={props.onAppendClick}
          >
            <EVAIcon
              name={props.appendName}
              fill={props.appendFill || colors.noir}
            />
          </InputGroupAddon>
        )}
      </InputGroup>
    );
  }
  return (
    <InputGroup className="mb-10 figma-input-group">
      {props.prepend && (
        <InputGroupAddon addonType="prepend" className="icon-prepend">
          <EVAIcon name={props.errorIcon || props.prependName} fill="#F44336" />
        </InputGroupAddon>
      )}
      <Input
        autoFocus={autoFocus}
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        autoComplete={props.autoComplete}
        disabled={props.disabled}
        className={[
          props.inputClassName,
          props.prepend ? "has-prepend" : "",
          props.newSize ? "new-size" : "",
          props.error ? "error" : "",
        ].join(" ")}
      />
      {props.errorType === "wrongPassword" ? (
        <InputGroupAddon
          addonType="append"
          className="icon-append"
          onClick={props.onAppendClick}
        >
          <EVAIcon
            name={props.appendName}
            fill={props.appendFill || colors.noir}
          />
        </InputGroupAddon>
      ) : (
        <InputGroupAddon
          addonType="append"
          className="icon-append"
          onClick={props.onAppendClick}
        >
          <EVAIcon name="alert-triangle" fill="#F44336" />
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

export default FInput;
