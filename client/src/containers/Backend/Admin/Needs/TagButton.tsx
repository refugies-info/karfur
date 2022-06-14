import React from "react";
import Streamline from "assets/streamline";
import { iconName } from "types/interface";
import styles from "./TagButton.module.scss";
import { cls } from "lib/classname";

// TODO: replace by FilterButton or FButton

interface Props {
  name: string;
  icon?: iconName;
  isSelected: boolean;
  color: string;
  onClick?: () => void;
}

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
      className={cls(
        styles.btn,
        !!props.isSelected && styles.selected,
        !!props.onClick && styles.clickable
      )}
      style={{ backgroundColor: props.color }}
    >
      {props.icon ? (
        <div className={styles.inner}>
          <Streamline
            name={props.icon}
            stroke={"white"}
            width={22}
            height={22}
          />
        </div>
      ) : null}
      <div>{props.name}</div>
    </button>
  );
};
