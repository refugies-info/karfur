import React from "react";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";

import styles from "./FButton.module.scss";

interface Props {
  type:
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
  className: string;
  fill: string;
  name: string;
  size: number;
  filter: boolean;
  tag: any;
  children: any;
  [x: string]: any;
}

const FButton = (props: Props) => {
  let {
    type,
    className,
    fill,
    name,
    size,
    filter,
    tag: Tag,
    children,
    ...bProps
  } = props;

  if (props.href && Tag === "button") Tag = "a";
  const themeType = type === "theme" ? " backgroundColor-darkColor" : "";

  const classNames = `${styles.btn} ${filter ? styles.filter : ""} ${
    styles[type] || ""
  } ${className || ""} ${themeType}`;

  return (
    <Tag className={classNames} {...bProps}>
      {name && (
        <EVAIcon
          name={name}
          fill={fill}
          size={size}
          className={props.children ? "mr-10" : ""}
        />
      )}
      {props.children}
    </Tag>
  );
};

FButton.defaultProps = {
  type: "default",
  tag: "button",
};

export default FButton;
