import { cls } from "lib/classname";
import { NeedTradStatus } from "components/Backend/screens/UserTranslation/types";
import EVAIcon from "components/UI/EVAIcon";
import { ExpertTradStatus, getStatusStyle, UserTradStatus } from "../functions";
import styles from "./TranslationStatus.module.scss";

interface Props {
  status: UserTradStatus | ExpertTradStatus | NeedTradStatus;
}

const TranslationStatus = (props: Props) => {
  const style = getStatusStyle(props.status);
  return (
    <div className={cls(styles.badge, styles[style.type])}>
      {props.status}
      <EVAIcon name={style.icon} size={16} className="ms-1" />
    </div>
  );
};

export default TranslationStatus;
