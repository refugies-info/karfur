import React from "react";
import Image from "next/image";
import { cls } from "lib/classname";
import { Theme } from "types/interface";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import ThemeBadge from "components/UI/ThemeBadge";
import iconMap from "assets/recherche/icon-map.svg";
import commonStyles from "scss/components/contentCard.module.scss";
import styles from "./DispositifCardTitle.module.scss";

interface Props {
  color?: string;
  count?: number;
  themes?: Theme[]; // available if cards for secondary themes
}

const DispositifCardTitle = (props: Props) => {
  const isSecondaryCard = props.themes && props.themes.length > 0;
  return (
    <div
      className={cls(commonStyles.card, commonStyles.dispositif, commonStyles.title)}
      style={props.color ? { background: props.color } : {}}
    >
      <div>
        {!isSecondaryCard && (
          <div className={commonStyles.icon}>
            <Image src={iconMap} width={32} height={32} alt="" />
          </div>
        )}
        <div className={cls(commonStyles.text, isSecondaryCard && styles.title_theme)}>
          {!isSecondaryCard ? "Les fiches dispositifs" : "Autres fiches dispositifs avec le thème"}
        </div>

        {isSecondaryCard && (
          <div className={styles.theme}>
            {props.themes?.map((theme, i) => (
              <ThemeBadge key={i} theme={theme} style={{ backgroundColor: "white" }} className="mr-2 mb-2" />
            ))}
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
