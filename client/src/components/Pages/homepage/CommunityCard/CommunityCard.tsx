import React, { useMemo } from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import Image from "next/image";
import styles from "./CommunityCard.module.scss";
import { InlineLink } from "components/Pages/staticPages/common";
import Link from "next/link";

type Color = "red" | "green" | "purple" | "brown" | "blue";

interface Props {
  title: string;
  subtitle: string;
  image: any;
  link?: string;
  countImage: number;
  cta?: string;
  badge?: string;
  color: Color;
}

const getIcon = (color: Color) => {
  switch (color) {
    case "red":
      return "edit-outline";
    case "green":
      return "message-circle-outline";
    case "purple":
      return "globe-2-outline";
    case "brown":
      return "code-outline";
    case "blue":
      return "person-outline";
  }
};

const CommunityCard = (props: Props) => {
  const content = useMemo(
    () => (
      <>
        <div>
          <div className={styles.image_container}>
            <Image src={props.image} width={176} height={80} alt={props.title} />
            <span className={styles.count}>+{props.countImage}</span>
          </div>
          <h3 className={styles.title}>{props.title}</h3>
          <p className={styles.subtitle}>{props.subtitle}</p>
        </div>

        <div className={styles.footer}>
          {props.cta && <InlineLink link="#" type="span" text={props.cta} color={props.color} />}
          {props.badge && (
            <span className={styles.badge}>
              <EVAIcon name={getIcon(props.color)} size={20} fill={styles[props.color]} className={styles.icon} />
              {props.badge}
            </span>
          )}
        </div>
      </>
    ),
    [props]
  );
  return !props.link ? (
    <div className={cls(styles.container, styles[`color_${props.color}`])}>{content}</div>
  ) : (
    <Link href={props.link} className={cls(styles.container, styles[`color_${props.color}`])}>
      {content}
    </Link>
  );
};

export default CommunityCard;
