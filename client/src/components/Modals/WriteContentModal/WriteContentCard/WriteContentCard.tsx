import React from "react";
import { useTranslation } from "next-i18next";
import Image from "next/legacy/image";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./WriteContentCard.module.scss";

interface Props {
  onSelect: () => void;
  color: "orange" | "red";
  imageSrc: string;
  type: string;
  description: string;
  duration: string;
  selected: boolean;
}

const WriteContentCard = (props: Props) => {
  const { t } = useTranslation();

  return (
    <button
      className={cls(styles.container, styles[props.color], props.selected && styles.selected)}
      onClick={props.onSelect}
    >
      <Image src={props.imageSrc} alt={props.type} width={200} height={162} />
      <div className={styles.inner}>
        <div>
          <p className={styles.title}>{t("Publish.writeModalTitle")}</p>
          <div className={styles.type}>{props.type}</div>
          <p className={styles.text}>{props.description}</p>
        </div>
        <div className={styles.time}>
          <EVAIcon name="clock-outline" fill="#000000" size={16} className="me-2" />
          {`~ ${props.duration} `}
          {t("minutes")}
        </div>
      </div>
    </button>
  );
};

export default WriteContentCard;
