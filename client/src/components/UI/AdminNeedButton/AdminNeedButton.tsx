import { cls } from "lib/classname";
import React from "react";
import { Need } from "types/interface";
import EVAIcon from "../EVAIcon/EVAIcon";
import styles from "./AdminNeedButton.module.scss";

interface Props {
  need: Need;
  onPress: () => void;
  onClickEdit?: () => void;
  selected: boolean;
  showCross?: boolean;
  opened?: boolean
  editButton?: boolean
}

const AdminThemeButton = (props: Props) => (
  <button
    onClick={props.onPress}
    className={cls(styles.btn)}
    style={{
      background: props.need.theme.colors.color30,
      borderColor: props.need.theme.colors.color100,
      borderWidth: props.selected || props.opened ? 1 : 0,
      borderStyle: "solid",
      margin: props.selected || props.opened ? 0 : 1,
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
      {props.editButton &&
        <span className={styles.edit} style={{backgroundColor: props.need.theme.colors.color100}}>
          <EVAIcon
            name="edit-outline"
            fill="white"
            size={16}
            onClick={(e: any) => {
              e.stopPropagation();
              if(props.onClickEdit) props.onClickEdit();
            }}
          />
        </span>
      }
      {props.opened &&
        <EVAIcon name="arrow-forward" fill={props.need.theme.colors.color100} size={20} className="ml-2" />
      }
    </span>
  </button>
);

export default AdminThemeButton;
