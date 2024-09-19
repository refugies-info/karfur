import React from "react";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";

import { cls } from "~/lib/classname";
import styles from "./FButton.module.scss";

interface Props {
  type?:
    | "default"
    | "saved"
    | "modified"
    | "white"
    | "dark"
    | "validate-light"
    | "validate"
    | "login"
    | "signup"
    | "error"
    | "light-action"
    | "small-figma"
    | "outline"
    | "outline-black"
    | "help"
    | "tuto"
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
  loading?: boolean;
  [x: string]: any;
}

/**
 * @deprecated use Button instead
 */
const FButton = React.forwardRef(({ type = "default", tag: Tag = "button", ...props }: Props, _ref) => {
  let { className, fill, name, size, filter, children, wrap, loading = false, ...bProps } = props;

  if (props.href && Tag === "button") Tag = "a";
  const themeType = type === "theme" ? " bg-darkColor" : "";

  const classNames = cls(
    styles.btn,
    filter ? styles.filter : false,
    type ? styles[type] : false,
    className || "",
    themeType,
    wrap ? styles.wrap : false,
  );

  return (
    <Tag className={classNames} {...bProps} style={props.theme && { backgroundColor: props.theme }}>
      {(name || loading) && (
        <EVAIcon
          name={loading ? "loader-outline" : name}
          fill={fill}
          size={size}
          className={props.children ? "me-2" : ""}
        />
      )}
      {props.children}
    </Tag>
  );
});

FButton.displayName = "FButton";

export default FButton;
