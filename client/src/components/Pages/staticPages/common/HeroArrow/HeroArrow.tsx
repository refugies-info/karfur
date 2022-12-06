import React from "react";
import Link from "next/link";
import { colors } from "colors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./HeroArrow.module.scss";

interface Props {
  target: string;
}

const HeroArrow = (props: Props) => {
  return (
    <div className={styles.container}>
      <Link href={`#${props.target}`}>
        <a className={styles.btn}>
          <EVAIcon name="arrow-downward-outline" size={24} fill={colors.bleuCharte} />
        </a>
      </Link>
    </div>
  );
};

export default HeroArrow;
