import { GetThemeResponse, Id } from "api-types";
import { cls } from "lib/classname";
import { ObjectId } from "mongodb";
import Image from "next/image";
import React from "react";
import EVAIcon from "../EVAIcon/EVAIcon";
import styles from "./AdminThemeButton.module.scss";

interface Props {
  theme: GetThemeResponse;
  onPress: () => void;
  onSelectTheme: (id: Id) => void;
  onClickEdit?: () => void;
  selected: boolean;
  opened: boolean;
  hasWarning?: boolean;
  editButton?: boolean;
}

const AdminThemeButton = (props: Props) => (
  <button
    onClick={props.onPress}
    className={cls(styles.btn)}
    style={{
      background: `linear-gradient(90deg, ${props.theme.colors.color80} 25%, ${props.theme.colors.color100} 100%)`,
      boxShadow: props.opened ? `0 0 4px 3px ${props.theme.colors.color30}, inset white 0 0 0 1px` : "none",
      opacity: props.theme.active ? 1 : 0.4
    }}
  >
    <div className={styles.image}>
      {props.theme?.appImage?.secure_url && (
        <Image src={props.theme.appImage.secure_url} width={36} height={50} alt="" />
      )}
    </div>
    <span className="ms-2">{props.theme.name.fr}</span>

    <span className="ms-auto">
      {props.selected && (
        <>
          <span className={styles.hoverHidden}>
            {props.hasWarning ? (
              <EVAIcon name="alert-triangle" fill="white" size={20} />
            ) : (
              <EVAIcon name="checkmark-outline" fill="white" size={20} />
            )}
          </span>
          <span className={styles.hoverVisible}>
            <EVAIcon
              name="close-outline"
              fill="white"
              size={20}
              onClick={(e: any) => {
                e.stopPropagation();
                props.onSelectTheme(props.theme._id);
              }}
            />
          </span>
        </>
      )}
      {props.editButton && (
        <span className={styles.edit}>
          <EVAIcon
            name="edit-outline"
            fill="dark"
            size={16}
            onClick={(e: any) => {
              e.stopPropagation();
              if (props.onClickEdit) props.onClickEdit();
            }}
          />
        </span>
      )}
      {props.opened && <EVAIcon name="arrow-forward" fill="white" size={20} className="ms-2" />}
    </span>
  </button>
);

export default AdminThemeButton;
