import React from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./Checkbox.module.scss";

interface Props {
  children: any;
  checked: boolean;
  color?: string;
}

const Checkbox = (props: Props) => {

  return (
    <div className={styles.checkbox}>
      <input type="checkbox" defaultChecked={props.checked} />
      <span className={styles.check}>
        <EVAIcon
          name={props.checked ? "checkmark-square-2" : "square-outline"}
          fill={props.color || "black"}
        />
      </span>
      <label>{props.children}</label>
    </div>
  );
};

export default Checkbox;
