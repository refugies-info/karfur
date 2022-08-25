import { cls } from "lib/classname";
import React from "react";
import { Need } from "types/interface";
import EVAIcon from "../EVAIcon/EVAIcon";
import styles from "./AdminNeedButton.module.scss";

interface Props {
  need: Need;
  onPress: () => void;
  selected: boolean;
  showCross?: boolean;
}

const AdminThemeButton = (props: Props) => (
  <button
    onClick={props.onPress}
    className={cls(styles.btn)}
    style={{
      background: props.need.theme.colors.color30,
      borderColor: props.need.theme.colors.color100,
      borderWidth: props.selected ? 1 : 0,
      borderStyle: "solid",
      margin: props.selected ? 0 : 1,
      color: props.need.theme.colors.color100
    }}
  >
    <span>{props.need.fr.text}</span>

    <span className="ml-auto">
      {(props.selected || props.showCross) && (
        <span className={styles.hoverVisible}>
          <EVAIcon name="close-outline" fill={props.need.theme.colors.color100} size={20} />
        </span>
      )}
      {props.selected && (
        <span className={styles.hoverHidden}>
          <EVAIcon name="checkmark-outline" fill={props.need.theme.colors.color100} size={20} />
        </span>
      )}
    </span>
  </button>
);

export default AdminThemeButton;
