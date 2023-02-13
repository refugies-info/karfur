import React from "react";
import styles from "./Metadatas.module.scss";

interface Props {
  title: string;
  text: string;
}

const Card = ({ title, text }: Props) => {
  return (
    <div className={styles.card}>
      <p className={styles.title}>{title}</p>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default Card;
