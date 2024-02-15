import { cls } from "lib/classname";
import styles from "./EditButton.module.scss";

const icons = {
  map: "fr-icon-map-pin-2-line",
  translate: "fr-icon-translate-2",
};

interface Props {
  icon: keyof typeof icons;
  onClick: () => void;
}

const EditButton = (props: Props) => (
  <button className={styles.button} onClick={props.onClick}>
    <i className={cls(icons[props.icon], styles.icon)} />
    Modifier
  </button>
);

export default EditButton;
