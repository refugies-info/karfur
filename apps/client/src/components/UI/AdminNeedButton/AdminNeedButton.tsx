import { GetNeedResponse } from "@refugies-info/api-types";
import Image from "next/image";
import { cls } from "~/lib/classname";
import EVAIcon from "../EVAIcon/EVAIcon";
import styles from "./AdminNeedButton.module.scss";

interface Props {
  need: GetNeedResponse;
  onPress: () => void;
  onClickEdit?: () => void;
  selected: boolean;
  showCross?: boolean;
  opened?: boolean;
  editButton?: boolean;
  draggable?: boolean;
}

const AdminThemeButton = (props: Props) => (
  <button
    onClick={props.onPress}
    className={cls(styles.btn)}
    style={{
      background: props.need.theme.colors.color30,
      borderColor: props.selected || props.opened ? props.need.theme.colors.color100 : "transparent",
      color: props.need.theme.colors.color100,
    }}
  >
    {props.draggable && <EVAIcon name="menu" size={20} fill={props.need.theme.colors.color100} className="me-4" />}

    {props.need.image?.secure_url && (
      <div className="me-4">
        <Image src={props.need.image?.secure_url} width={30} height={30} alt="" />
      </div>
    )}

    <div>
      <div className={styles.text}>{props.need.fr.text}</div>
      {props.need.fr.subtitle && <div className={styles.subtitle}>{props.need.fr.subtitle}</div>}
    </div>

    <span className="ms-auto">
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
      {props.editButton && (
        <span className={styles.edit} style={{ backgroundColor: props.need.theme.colors.color100 }}>
          <EVAIcon
            name="edit-outline"
            fill="white"
            size={16}
            onClick={(e: any) => {
              e.stopPropagation();
              if (props.onClickEdit) props.onClickEdit();
            }}
          />
        </span>
      )}
      {props.opened && (
        <EVAIcon name="arrow-forward" fill={props.need.theme.colors.color100} size={20} className="ms-2" />
      )}
    </span>
  </button>
);

export default AdminThemeButton;
