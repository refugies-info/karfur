import React from "react";
import Image from "next/image";
import iconMap from "assets/recherche/icon-map.svg";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
// import styles from "./DispositifCardTitle.module.scss";
import commonStyles from "scss/components/contentCard.module.scss";
import { cls } from "lib/classname";

interface Props {
  color?: string;
  count?: number;
}

const DispositifCardTitle = (props: Props) => {
  return (
    <div
      className={cls(commonStyles.card, commonStyles.dispositif, commonStyles.title)}
      style={props.color ? { background: props.color } : {}}
    >
      <div>
        <div className={commonStyles.icon}>
          <Image src={iconMap} width={32} height={32} alt="" />
        </div>
        <div className={commonStyles.text}>Les fiches dispositifs</div>

        {props.count !== undefined && (
          <div className={commonStyles.badge} style={props.color ? { color: props.color } : {}}>
            {props.count}
          </div>
        )}
      </div>
      <EVAIcon name="arrowhead-right-outline" fill="white" size={56} />
    </div>
  );
};

export default DispositifCardTitle;
