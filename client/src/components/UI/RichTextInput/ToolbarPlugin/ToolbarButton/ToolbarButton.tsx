import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import styles from "./ToolbarButton.module.scss";

interface Props {
  disabled?: boolean;
  onClick: () => void;
  title?: string;
  iconName: string;
  isPressed?: boolean;
}

const ToolbarButton = (props: Props) => {
  return (
    <button
      className={cls(styles.btn, props.isPressed && styles.selected)}
      disabled={props.disabled}
      onClick={props.onClick}
      title={props.title}
      aria-pressed={props.isPressed}
    >
      <EVAIcon fill="dark" name={props.iconName} />
    </button>
  );
};

export default ToolbarButton;
