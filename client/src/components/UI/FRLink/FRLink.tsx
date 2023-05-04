import React from "react";
import Link, { LinkProps } from "next/link";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./FRLink.module.scss";

interface Props {
  href: LinkProps["href"];
  children: string | React.ReactNode;
  className?: string;
  icon?: string;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: (e: any) => void;
}

const FRLink = (props: Props) => {
  return (
    <Link
      href={props.href}
      target={props.target}
      onClick={props.onClick}
      className={cls("fr-link", styles.link, props.className)}
    >
      {props.icon && (
        <EVAIcon name={props.icon} size={20} fill={styles.lightTextActionHighBlueFrance} className="me-2" />
      )}
      {props.children}
    </Link>
  );
};

export default FRLink;
