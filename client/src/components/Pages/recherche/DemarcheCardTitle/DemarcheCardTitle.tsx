import React from "react";
import styles from "./DemarcheCardTitle.module.scss";
import demarcheIcon from "assets/recherche/illu-demarche.svg";
import Image from "next/image";

interface Props {
  color?: string;
  count?: number;
}

const DemarcheCardTitle = (props: Props) => {
  return (
    <div className={styles.container} style={props.color ? { background: props.color } : {}}>
      <div className={styles.icon}>
        <Image src={demarcheIcon} width={32} height={32} alt="" />
      </div>
      <div className={styles.title}>Les fiches démarches</div>

      {props.count !== undefined &&
          <div
            className={styles.badge}
            style={props.color ? { color: props.color } : {}}
          >{props.count}</div>
        }
    </div>
  );
};

export default DemarcheCardTitle;
