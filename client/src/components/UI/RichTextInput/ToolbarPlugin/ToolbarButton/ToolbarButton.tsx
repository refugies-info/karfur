import { cls } from "lib/classname";
import styles from "./ToolbarButton.module.scss";
import ToolbarIcon from "../ToolbarIcon";

interface Props {
  disabled?: boolean;
  onClick: () => void;
  title?: string;
  icon: string;
  isPressed?: boolean;
}

const ToolbarButton = (props: Props) => {
  return (
    <button
      className={cls(styles.btn, props.isPressed && styles.selected)}
      disabled={props.disabled}
      onClick={(e: any) => {
        e.preventDefault();
        props.onClick();
      }}
      title={props.title}
      aria-pressed={props.isPressed}
    >
      <ToolbarIcon name={props.icon} />
    </button>
  );
};

export default ToolbarButton;
