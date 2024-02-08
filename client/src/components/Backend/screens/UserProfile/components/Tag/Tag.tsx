import { cls } from "lib/classname";
import styles from "./Tag.module.scss";

interface Props {
  children: string;
  className?: string;
}

const Tag = (props: Props) => <div className={cls(styles.tag, props.className)}>{props.children}</div>;

export default Tag;
