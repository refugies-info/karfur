import React from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";

import styles from "./FButton.module.scss";
import { cls } from "lib/classname";

interface Props {
  type?:
    | "default"
    | "saved"
    | "modified"
    | "white"
    | "white-yellow-hover"
    | "dark"
    | "validate-light"
    | "validate"
    | "validate-mockup"
    | "login"
    | "signup"
    | "error"
    | "light-action"
    | "small-figma"
    | "thanks"
    | "outline"
    | "outline-black"
    | "pill"
    | "hero"
    | "help"
    | "tuto"
    | "edit"
    | "precision"
    | "fill-dark"
    | "theme";
  className?: string;
  fill?: string;
  name?: string;
  size?: number;
  filter?: boolean;
  tag?: any;
  children?: any;
  theme?: string;
  wrap?: boolean;
  [x: string]: any;
}

const FButton = React.forwardRef((props: Props, ref) => {
  let { type, className, fill, name, size, filter, tag: Tag, children, wrap, ...bProps } = props;

  if (props.href && Tag === "button") Tag = "a";
  const themeType = type === "theme" ? " bg-darkColor" : "";

  const classNames = cls(
    styles.btn,
    filter ? styles.filter : false,
    type ? styles[type] : false,
    className || "",
    themeType,
    wrap ? styles.wrap : false
  );

  return (
    <Tag className={classNames} {...bProps} style={props.theme && { backgroundColor: props.theme }}>
      {name && <EVAIcon name={name} fill={fill} size={size} className={props.children ? "me-2" : ""} />}
      {props.children}
    </Tag>
  );
});

FButton.displayName = "FButton";

FButton.defaultProps = {
  type: "default",
  tag: "button"
};

export default FButton;
