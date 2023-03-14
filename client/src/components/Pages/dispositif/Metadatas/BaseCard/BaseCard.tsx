import React, { useMemo } from "react";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./BaseCard.module.scss";

export type BaseCardStatus = "done" | "error";

interface Item {
  label?: string;
  icon: React.ReactNode;
  content: string | React.ReactNode | undefined;
}

interface Props {
  title: string | React.ReactNode;
  color?: string;
  items: Item[];
  status?: BaseCardStatus;
  onClick?: () => void;
}

/**
 * Base component of the left sidebar card. Can be used in VIEW or EDIT mode
 */
const BaseCard = ({ title, items, color, status, onClick }: Props) => {
  const noContent = useMemo(() => !items || !items.find((item) => !!item.content), [items]);

  const cardContent = useMemo(
    () =>
      noContent ? null : (
        <>
          <p className={styles.title} style={{ color }}>
            {title}
            {status === "done" && (
              <EVAIcon
                name="checkmark-circle-2"
                fill={styles.lightPrimaryBlueFranceSun}
                className={cls(styles.status)}
              />
            )}
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
        </>
      ),
    [title, items, color, status, noContent],
  );

  if (!cardContent) return null;
  return onClick ? (
    <button className={cls(styles.card, styles.btn)} onClick={onClick}>
      {cardContent}
    </button>
  ) : (
    <div className={styles.card}>{cardContent}</div>
  );
};

export default BaseCard;
