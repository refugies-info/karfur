import React from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import icon_France from "assets/figma/icon_France.svg";
import icon_translate from "assets/comment-contribuer/translate-icon.svg";
import Image from "next/image";
import styles from "./HeaderCard.module.scss";

interface Props {
  title: string;
  eva?: boolean;
  iconName?: string;
}

const HeaderCard = (props: Props) => (
  <div className={styles.card}>
    <div className={styles.icon}>
      {props.eva ? (
        <EVAIcon name={props.iconName} size="xlarge" fill="#212121" />
      ) : props.iconName === "icon_France" ? (
        <Image src={icon_France} alt="icon_france" />
      ) : (
        <Image src={icon_translate} alt="icon_translate" />
      )}
    </div>
    {props.title}
  </div>
);

export default HeaderCard;
