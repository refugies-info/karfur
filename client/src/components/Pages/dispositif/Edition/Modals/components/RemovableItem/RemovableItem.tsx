import React from "react";
import Image from "next/image";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
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
      {props.text}
      <EVAIcon name="close-outline" fill={styles.lightTextActionHighBlueFrance} size={24} className="ms-2" />
    </button>
  );
};

export default RemovableItem;
