import Image from "next/image";
import React, { ReactElement } from "react";
import styles from "./Card.module.scss";

interface Props {
  title: string;
  children: any;
  image: any;
  footer?: ReactElement;
}

const Card = (props: Props) => {
  return (
    <div className={styles.container}>
      <div>
        <Image src={props.image} alt="" width={56} height={56} objectFit="contain" />
        <h3 className={styles.title}>{props.title}</h3>
        <div className={styles.text}>{props.children}</div>
      </div>
      <div>{props.footer}</div>
    </div>
  );
};

export default Card;
