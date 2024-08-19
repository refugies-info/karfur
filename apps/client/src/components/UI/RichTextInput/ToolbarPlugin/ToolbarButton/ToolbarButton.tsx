import { useMemo } from "react";
import { cls } from "lib/classname";
import ToolbarIcon from "../ToolbarIcon";
import styles from "./ToolbarButton.module.scss";

interface Props {
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
  icon?: string;
  text?: string;
  isPressed?: boolean;
  hasSelectedIcon?: boolean;
  noButton?: boolean;
  className?: string;
}

const ToolbarButton = (props: Props) => {
  const classes = useMemo(
    () =>
      cls(
        styles.btn,
        props.icon && !props.text && styles.icon_btn,
        !!props.text && styles.text_btn,
        props.isPressed && styles.selected,
        props.className,
      ),
    [props.icon, props.text, props.isPressed, props.className],
  );
  const content = useMemo(
    () => (
      <>
        {props.icon && <ToolbarIcon name={props.icon} className={cls(styles.icon, !!props.text && "me-2")} />}
        {props.text}
        {props.hasSelectedIcon && props.isPressed && (
          <ToolbarIcon name="ri-checkbox-circle-fill" className={cls(styles.icon, !!props.text && "ms-2")} />
        )}
      </>
    ),
    [props.icon, props.text, props.hasSelectedIcon, props.isPressed],
  );

  if (props.noButton) return <span className={classes}>{content}</span>;
  return (
    <button
      className={classes}
      disabled={props.disabled}
      onClick={(e: any) => {
        e.preventDefault();
        props.onClick ? props.onClick() : () => {};
      }}
      title={props.title}
      aria-pressed={props.isPressed}
    >
      {content}
    </button>
  );
};

export default ToolbarButton;
