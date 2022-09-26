import React from "react";
import Image from "next/image";
import iconMap from "assets/recherche/icon-map.svg";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import commonStyles from "scss/components/contentCard.module.scss";
import { cls } from "lib/classname";
import { Theme } from "types/interface";
import ThemeBadge from "components/UI/ThemeBadge";
import styles from "./DispositifCardTitle.module.scss";

interface Props {
  color?: string;
  count?: number;
  theme?: Theme; // available if cards for secondary themes
}

const DispositifCardTitle = (props: Props) => {
  return (
    <div
      className={cls(commonStyles.card, commonStyles.dispositif, commonStyles.title)}
      style={props.color ? { background: props.color } : {}}
    >
      <div>
        {!props.theme && (
          <div className={commonStyles.icon}>
            <Image src={iconMap} width={32} height={32} alt="" />
          </div>
        )}
        <div className={cls(commonStyles.text, props.theme && styles.title_theme)}>
          {!props.theme ? "Les fiches dispositifs" : "Autres fiches dispositifs avec le thème"}
        </div>

        {props.theme && (
          <div className={styles.theme}>
            <ThemeBadge theme={props.theme} style={{ backgroundColor: "white" }} />
          </div>
        )}

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
