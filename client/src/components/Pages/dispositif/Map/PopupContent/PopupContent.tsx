import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { useSanitizedContent } from "hooks";
import { Marker } from "../Map";
import styles from "./PopupContent.module.scss";

interface Props {
  marker: Marker;
  onClose: () => void;
}

const PopupContent = ({ marker, onClose }: Props) => {
  const safeDescription = useSanitizedContent(marker.description);
  return (
    <div onClick={(e: any) => e.stopPropagation()} className={styles.popup}>
      <div className={styles.close} onClick={onClose}>
        <EVAIcon name="close-outline" size={16} fill={styles.lightTextActionHighBlueFrance} />
      </div>
      <p className={styles.title}>{marker.title}</p>
      <p className={styles.info}>
        <EVAIcon name="pin-outline" size={16} fill="dark" className="me-1" />
        <span>
          {marker.address}, {marker.city}
        </span>
      </p>
      {marker.email && (
        <p className={styles.info}>
          <EVAIcon name="email-outline" size={16} fill="dark" className="me-1" />
          <span>{marker.email.replace("&nbsp;", "")}</span>
        </p>
      )}
      {marker.phone && (
        <p className={styles.info}>
          <EVAIcon name="phone-outline" size={16} fill="dark" className="me-1" />
          <span>{marker.phone}</span>
        </p>
      )}
      {safeDescription && (
        <p className={styles.info}>
          <EVAIcon name="clock-outline" size={16} fill="dark" className="me-1" />
          <span
            dangerouslySetInnerHTML={{
              __html: safeDescription,
            }}
          ></span>
        </p>
      )}
    </div>
  );
};

export default PopupContent;
