import { useTranslation } from "next-i18next";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import useRTL from "~/hooks/useRTL";
import { colors } from "~/utils/colors";
import styles from "./FButtonMobile.module.scss";

interface Props {
  name: string;
  fill: string;
  i18nKey: string;
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
        backgroundColor: props.isDisabled ? colors.gray60 : props.color,
        color: props.fill,
      }}
    >
      <span className={`${styles.icon} ${isRTL && styles.rtl}`}>
        <EVAIcon name={props.name} fill={props.fill} size={"large"} />
      </span>

      <>{t(props.i18nKey, props.defaultTitle)}</>
    </button>
  );
};
