import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { useRTL } from "hooks";
import { cls } from "lib/classname";
import Link from "next/link";
import React, { useMemo } from "react";
import styles from "./InlineLink.module.scss";

interface Props {
  link: string;
  text: string;
  color: "purple" | "red" | "orange" | "blue" | "white";
  onClick?: () => void;
}

const InlineLink = (props: Props) => {
  const isExternalLink = props.link.startsWith("http");
  const isRTL = useRTL();

  const content = useMemo(
    () => (
      <>
        <span>{props.text}</span>
        <EVAIcon
          name={isRTL ? "arrow-back-outline" : "arrow-forward-outline"}
          size={24}
          fill={styles[props.color]}
          className={styles.icon}
        />
      </>
    ),
    [props.text, props.color, isRTL]
  );

  return !props.onClick ? (
    <Link
      href={props.link}
      className={cls(styles.link, styles[`color_${props.color}`])}
      rel="noopener noreferrer"
      target={isExternalLink ? "_blank" : undefined}
    >
      {content}
    </Link>
  ) : (
    <button className={cls(styles.link, styles[`color_${props.color}`])} onClick={props.onClick}>
      {content}
    </button>
  );
};

export default InlineLink;
