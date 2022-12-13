import React from "react";
import { useTranslation } from "next-i18next";
import styles from "./StructureType.module.scss";

interface Props {
  type: string;
}
export const StructureType = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* @ts-ignore */}
      {t("Annuaire." + props.type, props.type)}
    </div>
  )
}
