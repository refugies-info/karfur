import { cls } from "lib/classname";
import Image from "next/legacy/image";
import React, { ReactElement } from "react";
import styles from "./Card.module.scss";

interface Props {
  title: string;
  children: any;
  image?: any;
  header?: ReactElement;
  footer?: ReactElement;
  greyBackground?: boolean;
  withShadow?: boolean;
}

const Card = (props: Props) => {
  return (
    <div className={cls(styles.container, props.greyBackground && styles.grey, props.withShadow && styles.shadow)}>
      <div>
        <div className={styles.header}>
          {props.header}
          {props.image && <Image src={props.image} alt="" width={56} height={56} objectFit="contain" />}
        </div>
        <h3 className={styles.title}>{props.title}</h3>
        <div className={cls(styles.text, !props.footer && "mb-0")}>{props.children}</div>
      </div>
      <div>{props.footer}</div>
    </div>
  );
};

export default Card;
