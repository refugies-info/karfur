import React, { useMemo } from "react";
import Link, { LinkProps } from "next/link";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./FRLink.module.scss";

interface Props {
  href?: LinkProps["href"];
  children: string | React.ReactNode;
  className?: string;
  icon?: string;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: (e: any) => void;
}

const FRLink = (props: Props) => {
  const content = useMemo(() => {
    return (
      <>
        {props.icon && (
          <EVAIcon name={props.icon} size={20} fill={styles.lightTextActionHighBlueFrance} className="me-2" />
        )}
        {props.children}
      </>
    );
  }, [props.icon, props.children]);

  return !props.href ? (
    <button onClick={props.onClick} className={cls("fr-link", styles.link, props.className)}>
      {content}
    </button>
  ) : (
    <Link
      href={props.href}
      target={props.target}
      onClick={props.onClick}
      className={cls("fr-link", styles.link, props.className)}
    >
      {content}
    </Link>
  );
};

export default FRLink;
