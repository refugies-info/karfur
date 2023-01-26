import { cls } from "lib/classname";
import React from "react";
import styles from "./FSwitch.module.scss";

interface Props {
  checked: boolean;
  onClick?: any;
  large?: boolean;
  precontent?: string;
  content?: string;
  className?: string;
}

const FSwitch = (props: Props) => {
  return (
    <div className={cls(styles.switch, props.large && styles.large)}>
      {props.precontent && <span className="me-2">{props.precontent}</span>}
      <div className={"form-check form-switch"}>
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          checked={props.checked}
          aria-checked={props.checked}
          onClick={props.onClick}
          readOnly
        />
        <label className={"form-check-label ms-2" + (props.className || "")}>{props.content}</label>
      </div>
    </div>
  );
};

export default FSwitch;
