import React from "react";
import styles from "./TagButton.module.scss";
import { cls } from "lib/classname";
import { jsUcfirst } from "lib";
import { GetThemeResponse } from "@refugies-info/api-types";

interface Props {
  theme: GetThemeResponse;
  isSelected: boolean;
  onClick?: () => void;
}

/**
 * @deprecated replace by FilterButton or FButton
 */
export const TagButton = (props: Props) => {
  const onTagClick = () => {
    if (props.onClick) {
      return props.onClick();
    }
    return;
  };
  return (
    <button
      onClick={onTagClick}
      className={cls(styles.btn, !!props.isSelected && styles.selected, !!props.onClick && styles.clickable)}
      style={{ backgroundColor: props.theme.colors.color100 }}
    >
      <div>{jsUcfirst(props.theme.short.fr)}</div>
    </button>
  );
};
