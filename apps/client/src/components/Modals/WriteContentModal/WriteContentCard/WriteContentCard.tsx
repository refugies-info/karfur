import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import Image from "~/components/UI/Image";
import { cls } from "~/lib/classname";
import styles from "./WriteContentCard.module.scss";

interface Props {
  onSelect: () => void;
  color: "orange" | "red";
  imageSrc: string;
  type: string;
  description: string;
  duration: string;
  selected: boolean;
}

const WriteContentCard = (props: Props) => (
  <button
    className={cls(styles.container, styles[props.color], props.selected && styles.selected)}
    onClick={props.onSelect}
    aria-pressed={props.selected}
  >
    <Image src={props.imageSrc} alt="" width={200} height={162} />
    <div className={styles.inner}>
      <div>
        <p className={styles.title}>Rédiger une fiche</p>
        <div className={styles.type}>{props.type}</div>
        <p className={styles.text}>{props.description}</p>
      </div>
      <div className={styles.time}>
        <EVAIcon name="clock-outline" fill="#000000" size={16} className="me-2" />
        {`~ ${props.duration} minutes`}
      </div>
    </div>
  </button>
);

export default WriteContentCard;
