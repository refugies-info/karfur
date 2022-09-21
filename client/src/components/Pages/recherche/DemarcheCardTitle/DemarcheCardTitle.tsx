import React from "react";
import demarcheIcon from "assets/recherche/illu-demarche.svg";
import Image from "next/image";
// import styles from "./DemarcheCardTitle.module.scss";
import commonStyles from "scss/components/contentCard.module.scss";
import { cls } from "lib/classname";

interface Props {
  color?: string;
  count?: number;
}

const DemarcheCardTitle = (props: Props) => {
  return (
    <div
      className={cls(commonStyles.card, commonStyles.demarche, commonStyles.title)}
      style={props.color ? { background: props.color } : {}}
    >
      <div className={commonStyles.icon}>
        <Image src={demarcheIcon} width={32} height={32} alt="" />
      </div>
      <div className={commonStyles.text}>Les fiches démarches</div>

      {props.count !== undefined && (
        <div className={commonStyles.badge} style={props.color ? { color: props.color } : {}}>
          {props.count}
        </div>
      )}
    </div>
  );
};

export default DemarcheCardTitle;
