import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { cls } from "~/lib/classname";
import styles from "./TextExample.module.scss";

interface Props {
  text: string;
  type: "success" | "error";
}

const TextExample = (props: Props) => {
  return (
    <p className={cls(styles.container, styles[props.type])}>
      <span className={styles.icon}>
        <EVAIcon
          name={props.type === "error" ? "close-outline" : "checkmark"}
          fill="white"
          size={16}
          ariaLabel={props.type === "error" ? "À éviter" : "À faire"}
        />
      </span>
      {props.text}
    </p>
  );
};

export default TextExample;
