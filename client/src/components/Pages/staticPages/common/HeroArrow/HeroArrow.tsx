import React from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { colors } from "colors";
import { cls } from "lib/classname";
import { smoothScroll } from "lib/smoothScroll";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./HeroArrow.module.scss";

interface Props {
  target: string;
  center?: boolean;
}

const HeroArrow = (props: Props) => {
  const { t } = useTranslation();
  return (
    <div className={cls(styles.container, props.center && styles.center)}>
      <Link href={`#${props.target}`} className={styles.btn} onClick={smoothScroll} title={t("Suivant")}>
        <EVAIcon name="arrow-downward-outline" size={24} fill={colors.bleuCharte} />
      </Link>
    </div>
  );
};

export default HeroArrow;
