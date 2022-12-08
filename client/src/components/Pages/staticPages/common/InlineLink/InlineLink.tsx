import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import Link from "next/link";
import React, { useMemo } from "react";
import styles from "./InlineLink.module.scss";

interface Props {
  link: string;
  text: string;
  color: "purple" | "red" | "orange" | "blue";
  onClick?: () => void;
}

const InlineLink = (props: Props) => {
  const isExternalLink = props.link.startsWith("http");

  const content = useMemo(
    () => (
      <>
        <span>{props.text}</span>
        <EVAIcon name="arrow-forward-outline" size={24} fill={styles[props.color]} className={styles.icon} />
      </>
    ),
    [props.text, props.color]
  );

  return !props.onClick ? (
    <Link href={props.link}>
      <a
        className={cls(styles.link, styles[`color_${props.color}`])}
        rel="noopener noreferrer"
        target={isExternalLink ? "_blank" : undefined}
      >
        {content}
      </a>
    </Link>
  ) : (
    <button className={cls(styles.link, styles[`color_${props.color}`])} onClick={props.onClick}>
      {content}
    </button>
  );
};

export default InlineLink;
