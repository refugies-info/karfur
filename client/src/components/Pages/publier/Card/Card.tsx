import Image from "next/image";
import React from "react";
import styles from "./Card.module.scss";

interface Props {
  title: string;
  children: any;
  image: any;
}

const Card = (props: Props) => {
  return (
    <div className={styles.container}>
      <Image src={props.image} alt="" width={56} height={56} objectFit="contain" />
      <h3 className={styles.title}>{props.title}</h3>
      <div className={styles.text}>{props.children}</div>
    </div>
  );
};

export default Card;
