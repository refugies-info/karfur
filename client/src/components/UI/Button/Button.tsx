import React from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { Button } from "@dataesr/react-dsfr";
import { cls } from "lib/classname";
import styles from "./Button.module.scss";

interface Props {
  id?: string;
  secondary?: boolean;
  tertiary?: boolean;
  hasBorder?: boolean;
  icon?: string;
  iconPlacement?: "start" | "end";
  disabled?: boolean;
  onClick?: (...args: any[]) => any;
  title?: string;
  className?: string;
  children?: string | React.ReactNode;
  submit?: boolean;
  /**
   * colors[0] is background, colors[1] is color
   */
  colors?: string[];
}

const getIconColor = (props: Props) => {
  if (props.disabled) return styles.lightTextDisabledGrey;
  return props.secondary || props.tertiary ? styles.lightTextActionHighBlueFrance : "white";
};
const getIconMargin = (props: Props) => {
  if (!props.children) return "";
  return props.iconPlacement === "end" ? "ms-2" : "me-2";
};

const DSFRButton = (props: Props) => {
  const riIcon = props.icon?.startsWith("ri-") ? props.icon : undefined;
  const evaIcon = !props.icon?.startsWith("ri-") ? props.icon : undefined;

  return (
    <Button
      className={cls(
        styles.btn,
        !!props.children && styles.small_icon,
        props.iconPlacement === "end" && styles.icon_end,
        props.className,
      )}
      secondary={props.secondary}
      tertiary={props.tertiary}
      hasBorder={props.hasBorder}
      disabled={props.disabled}
      onClick={props.onClick}
      title={props.title}
      submit={props.submit}
      colors={props.colors}
      icon={riIcon}
      //@ts-ignore
      id={props.id}
    >
      {(props.children || evaIcon) && (
        <>
          {evaIcon && <EVAIcon name={evaIcon} fill={getIconColor(props)} className={getIconMargin(props)} />}
          {props.children}
        </>
      )}
    </Button>
  );
};

export default DSFRButton;
