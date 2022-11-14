import React from "react";
import Image from "next/image";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./HomeTypeCard.module.scss";

interface Props {
  image: any;
  title: string;
  buttonTitle: string;
  examples: string[];
  onClick: () => void;
}

const HomeTypeCard = (props: Props) => {
  return (
    <button
      className={styles.type_card}
      onClick={() => {
        props.onClick();
        window.scrollTo(0, 0);
      }}
    >
      <div className={styles.image}>
        <Image src={props.image} width={120} height={120} alt={props.title} />
      </div>
      <h3 className={cls("h4", styles.title)} dangerouslySetInnerHTML={{ __html: props.title }}></h3>
      <p>
        {props.examples.map((text, i) => (
          <span key={i}>
            {text}
            {i + 2 < props.examples.length && ", "}
          </span>
        ))}
      </p>
      <div className={styles.btn}>
        {props.buttonTitle}
        <EVAIcon name="arrow-forward-outline" fill="white" />
      </div>
    </button>
  );
};

export default HomeTypeCard;
