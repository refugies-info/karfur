import React from "react";
import Image from "next/image";
import { cls } from "lib/classname";
import styles from "./RichCheckbox.module.scss";

interface Props {
  text: string | React.ReactNode;
  name: string;
  value: string;
  checked: boolean;
  onSelect: () => void;
  image?: any;
  illuComponent?: React.ReactNode;
  className?: string;
}

const RichCheckbox = (props: Props) => {
  return (
    <label
      className={cls(styles.choice, props.checked && styles.selected, props.className)}
      onClick={(e: any) => {
        e.preventDefault();
        props.onSelect();
      }}
      htmlFor={props.name}
    >
      <input type="checkbox" value={props.value} name={props.name} defaultChecked={props.checked} />
      <i className={`${props.checked ? "ri-checkbox-fill" : "ri-checkbox-blank-line"} me-2`} />
      <span className={styles.text}>{props.text}</span>

      {props.image && <Image src={props.image} width={48} height={48} alt="" />}
      {props.illuComponent || null}
    </label>
  );
};

export default RichCheckbox;
