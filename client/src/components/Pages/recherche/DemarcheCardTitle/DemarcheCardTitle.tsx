import React from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { cls } from "lib/classname";
import demarcheIcon from "assets/recherche/illu-demarche.svg";
import commonStyles from "scss/components/contentCard.module.scss";
// import styles from "./DemarcheCardTitle.module.scss";

interface Props {
  color?: string;
  count?: number;
}

const DemarcheCardTitle = (props: Props) => {
  const { t } = useTranslation();
  return (
    <div
      className={cls(commonStyles.card, commonStyles.demarche, commonStyles.title)}
      style={props.color ? { background: props.color } : {}}
    >
      <div className={commonStyles.icon}>
        <Image src={demarcheIcon} width={32} height={32} alt="" />
      </div>
      <div className={commonStyles.text}>{t("Recherche.demarcheTitle", "Les fiches démarches")}</div>

      {props.count !== undefined && (
        <div className={commonStyles.badge} style={props.color ? { color: props.color } : {}}>
          {props.count}
        </div>
      )}
    </div>
  );
};

export default DemarcheCardTitle;
