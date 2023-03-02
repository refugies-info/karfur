import React from "react";
import { Link as DSFRLink } from "@dataesr/react-dsfr";
import Link, { LinkProps } from "next/link";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./FRLink.module.scss";

interface Props {
  href: LinkProps["href"];
  children: string | React.ReactNode;
  className?: string;
  icon?: string;
}

const FRLink = (props: Props) => {
  return (
    <DSFRLink
      as={
        <Link href={props.href}>
          {props.icon && <EVAIcon name={props.icon} size={20} fill="#000091" className="me-2" />}
          {props.children}
        </Link>
      }
      className={cls(styles.link, props.className)}
    />
  );
};

export default FRLink;
