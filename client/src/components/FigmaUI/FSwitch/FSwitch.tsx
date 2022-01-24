import React from "react";
import styles from "./FSwitch.module.scss";

interface Props {
  checked: boolean
  onClick?: any
  large?: boolean
  precontent?: string
  content?: string
  className?: string
}

const FSwitch = (props: Props) => {
  return (
    <div className={`${styles.switch} ${props.large ? styles.large : ""}`}>
      <span>{props.precontent}</span>
      <label
        className={
          "form-check-label switch switch-outline-light switch-pill mr-10 " +
          (props.precontent ? "ml-10 " : " ") +
          (props.className || "")
        }
      >
        <input
          className="form-check-input switch-input"
          type="checkbox"
          role="switch"
          checked={props.checked}
          aria-checked={props.checked}
          onClick={props.onClick}
        />
        <span className="switch-slider" />
      </label>
      <span>{props.content}</span>
    </div>
  );
};

export default FSwitch;
