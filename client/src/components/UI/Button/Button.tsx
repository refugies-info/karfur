import React, { useMemo } from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { Button, ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { cls } from "lib/classname";
import styles from "./Button.module.scss";

interface Props {
  id?: string;
  priority?: ButtonProps["priority"];
  hasBorder?: boolean;
  icon?: ButtonProps["iconId"];
  evaIcon?: string;
  iconPosition?: ButtonProps["iconPosition"];
  disabled?: boolean;
  onClick?: (...args: any[]) => any;
  title?: string;
  className?: string;
  children?: string | React.ReactNode;
  nativeButtonProps?: ButtonProps["nativeButtonProps"];
  size?: ButtonProps["size"];
  isLoading?: boolean;
}

const getIconColor = (props: Props) => {
  if (props.disabled) return styles.lightTextDisabledGrey;
  return (["secondary", "tertiary", "tertiary no outline"] as ButtonProps["priority"][]).includes(props.priority)
    ? styles.lightTextActionHighBlueFrance
    : "white";
};
const getIconMargin = (props: Props) => {
  if (!props.children) return "";
  return props.iconPosition === "right" ? "ms-2" : "me-2";
};

const DSFRButton = (props: Props) => {
  const content = useMemo(() => {
    return props.isLoading || props.children || props.evaIcon ? (
      <>
        {props.isLoading && (
          <EVAIcon
            name="loader-outline"
            fill={getIconColor(props)}
            className={cls(getIconMargin(props), styles.loading)}
          />
        )}
        {(props.children || props.evaIcon) && (
          <>
            {props.evaIcon && !props.isLoading && (
              <EVAIcon name={props.evaIcon} fill={getIconColor(props)} className={getIconMargin(props)} />
            )}
            {props.children}
          </>
        )}
      </>
    ) : undefined; // needed to get an icon only dsfr style
  }, [props]);

  return (
    //@ts-ignore FIXME icon type
    <Button
      className={cls(
        styles.btn,
        !!props.children && styles.small_icon,
        props.iconPosition === "right" && styles.icon_end,
        props.className,
      )}
      iconPosition={props.iconPosition}
      priority={props.priority}
      disabled={props.disabled}
      onClick={props.onClick}
      title={props.title}
      iconId={props.isLoading ? undefined : props.icon}
      size={props.size}
      nativeButtonProps={{ id: props.id, ...(props.nativeButtonProps || {}) }}
    >
      {content}
    </Button>
  );
};

export default DSFRButton;
