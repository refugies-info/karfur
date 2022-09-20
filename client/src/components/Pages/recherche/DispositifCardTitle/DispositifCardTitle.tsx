import React from "react";
import Image from "next/image";
import styles from "./DispositifCardTitle.module.scss";
import iconMap from "assets/recherche/icon-map.svg";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";

interface Props {
  color?: string;
  count?: number;
}

const DispositifCardTitle = (props: Props) => {
  return (
    <div className={styles.container} style={props.color ? { background: props.color } : {}}>
      <div>
        <div className={styles.icon}>
          <Image src={iconMap} width={32} height={32} alt="" />
        </div>
        <div className={styles.title}>Les fiches dispositifs</div>

        {props.count !== undefined &&
          <div
            className={styles.badge}
            style={props.color ? { color: props.color } : {}}
          >{props.count}</div>
        }
      </div>
      <EVAIcon name="arrowhead-right-outline" fill="white" size={56} />
    </div>
  );
};

export default DispositifCardTitle;
