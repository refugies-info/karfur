import Image from "next/image";
import React from "react";
import styles from "./Card.module.scss";

interface Item {
  label?: string;
  icon: React.ReactNode;
  content: string | React.ReactNode | undefined;
}

interface Props {
  title: string | React.ReactNode;
  color?: string;
  items: Item[];
}

const Card = ({ title, items, color }: Props) => {
  const noContent = !items.find((item) => !!item.content);
  if (noContent) return null;

  return (
    <div className={styles.card}>
      <p className={styles.title} style={{ color }}>
        {title}
      </p>
      {items.map((item, i) =>
        item.content ? (
          <div key={i} className={styles.item}>
            <div className={styles.icon}>{item.icon}</div>
            <div className={styles.details}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.content}>{item.content}</span>
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
};

export default Card;
