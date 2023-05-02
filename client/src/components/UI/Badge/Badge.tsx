import React from "react";
import Badge, { BadgeProps } from "@codegouvfr/react-dsfr/Badge";
import { cls } from "lib/classname";
import styles from "./Badge.module.scss";

interface Props {
  children: BadgeProps["children"];
  severity?: BadgeProps["severity"];
  small?: BadgeProps["small"];
  className?: string;
  icon?: string;
}

const DSFRBadge = (props: Props) => {
  return (
    <Badge className={props.className} severity={props.severity} small={props.small}>
      {props.icon && <i className={cls(styles.icon, props.small && styles.small, props.icon, "me-1")} />}
      {props.children}
    </Badge>
  );
};

export default DSFRBadge;
