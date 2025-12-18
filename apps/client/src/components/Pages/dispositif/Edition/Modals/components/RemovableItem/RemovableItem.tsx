import { fr } from "@codegouvfr/react-dsfr";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import Image from "~/components/UI/Image";
import { cls } from "~/lib/classname";
import styles from "./RemovableItem.module.scss";

interface Props {
  text: string;
  onClick: () => void;
  image?: string;
}

const RemovableItem = (props: Props) => {
  return (
    <button
      className={styles.btn}
      onClick={(e: any) => {
        e.preventDefault();
        props.onClick();
      }}
    >
      {props.image && (
        <Image
          src={props.image}
          width={24}
          height={24}
          alt=""
          style={{ objectFit: "contain" }}
          className={cls("me-2", styles.image)}
        />
      )}
      <span className={styles.label}>{props.text}</span>
      <EVAIcon
        name="close-outline"
        fill={fr.colors.decisions.text.actionHigh.blueFrance.default}
        size={24}
        className="ms-2"
      />
    </button>
  );
};

export default RemovableItem;
