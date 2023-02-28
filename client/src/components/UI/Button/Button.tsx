import React, { useMemo } from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { Button } from "@dataesr/react-dsfr";
import { cls } from "lib/classname";
import styles from "./Button.module.scss";

interface Props {
  secondary?: boolean;
  tertiary?: boolean;
  hasBorder?: boolean;
  icon?: string;
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

const DSFRButton = (props: Props) => {
  return (
    <Button
      className={cls(styles.btn, props.className)}
      secondary={props.secondary}
      tertiary={props.tertiary}
      hasBorder={props.hasBorder}
      disabled={props.disabled}
      onClick={props.onClick}
      title={props.title}
      submit={props.submit}
      colors={props.colors}
    >
      <>
        {props.icon && (
          <EVAIcon name={props.icon} fill={props.secondary ? "#000091" : "white"} size={16} className="me-2" />
        )}
        {props.children}
      </>
    </Button>
  );
};

export default DSFRButton;
