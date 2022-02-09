import React from "react";
import { useTranslation } from "next-i18next";
import { colors } from "colors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./FButtonMobile.module.scss";
import useRTL from "hooks/useRTL";

interface Props {
  name: string;
  fill: string;
  title: string;
  defaultTitle: string;
  color: string;
  isDisabled: boolean;
  onClick: (e: any) => void;
}

export const FButtonMobile = (props: Props) => {
  const isRTL = useRTL();
  const { t } = useTranslation();

  return (
    <button
      onClick={props.isDisabled ? () => {} : props.onClick}
      className={styles.btn}
      style={{
        backgroundColor: props.isDisabled ? colors.grey : props.color,
        color: props.fill
      }}
    >
      <span className={`${styles.icon} ${isRTL && styles.rtl}`}>
        <EVAIcon name={props.name} fill={props.fill} size={"large"} />
      </span>

      {t(props.title, props.defaultTitle)}
    </button>
  );
};
