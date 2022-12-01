import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import Link from "next/link";
import React from "react";
import styles from "./InlineLink.module.scss";

interface Props {
  link: string;
  text: string;
  color: "purple" | "red" | "orange";
}

const InlineLink = (props: Props) => {
  return (
    <Link href={props.link}>
      <a className={cls(styles.link, styles[`color_${props.color}`])} rel="noopener noreferrer">
        <span>{props.text}</span>
        <EVAIcon name="arrow-forward-outline" size={24} fill={styles[props.color]} className={styles.icon} />
      </a>
    </Link>
  );
};

export default InlineLink;
