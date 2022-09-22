import React from "react";
import Image from "next/image";
import Link from "next/link";
import { colors } from "colors";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./HomeTypeCard.module.scss";

interface Props {
  image: any;
  title: string;
  examples: string[];
  onClick: () => void
  link: string
}

const HomeTypeCard = (props: Props) => {
  return (
    <Link href={props.link}>
      <a className={styles.type_card} onClick={props.onClick}>
        <Image src={props.image} width={160} height={160} alt={props.title} />
        <h3 className={cls("h5", styles.title)}>{props.title}</h3>
        <ul>
          {props.examples.map((text, i) => (
            <li key={i}>
              <EVAIcon name="checkmark-outline" fill={colors.gray80} size={20} className="mr-2" />
              {text}
            </li>
          ))}
        </ul>
      </a>
    </Link>
  );
};

export default HomeTypeCard;
