import React from "react";
import Streamline from "assets/streamline";
import { iconName } from "types/interface";
import styles from "./TagName.module.scss";

interface Props {
  name: string
  icon: iconName
}

const TagName = (props: Props) => (
  <div className={styles.container}>
    <span className={styles.icon}>
      <Streamline
        name={props.icon}
        stroke="white"
        width={20}
        height={20}
      />
    </span>
    <span>{props.name}</span>
  </div>
);


export default TagName;
