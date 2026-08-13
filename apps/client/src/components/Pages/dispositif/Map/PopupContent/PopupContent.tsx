import { fr } from "@codegouvfr/react-dsfr";
import { useTranslation } from "next-i18next";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { useSanitizedContent } from "~/hooks";
import type { Marker } from "../Map";
import styles from "./PopupContent.module.scss";

interface Props {
  marker: Marker;
  onClose: () => void;
}

const PopupContent = ({ marker, onClose }: Props) => {
  const { t } = useTranslation();
  const safeDescription = useSanitizedContent(marker.description);
  return (
    <div onClick={(e: any) => e.stopPropagation()} className={styles.popup}>
      <div className={styles.close} onClick={onClose}>
        <EVAIcon
          name="close-outline"
          size={16}
          fill={fr.colors.decisions.text.actionHigh.blueFrance.default}
          ariaLabel={t("close", "Fermer")}
        />
      </div>
      <p className={styles.title}>{marker.title}</p>
      <p className={styles.info}>
        <EVAIcon
          name="pin-outline"
          size={16}
          fill="dark"
          className="me-1"
          ariaLabel={t("Dispositif.address", "Adresse")}
        />
        <span>
          {marker.address}, {marker.city}
        </span>
      </p>
      {marker.email && (
        <p className={styles.info}>
          <EVAIcon
            name="email-outline"
            size={16}
            fill="dark"
            className="me-1"
            ariaLabel={t("Dispositif.email", "Email")}
          />
          <span>{marker.email.replace("&nbsp;", "")}</span>
        </p>
      )}
      {marker.phone && (
        <p className={styles.info}>
          <EVAIcon
            name="phone-outline"
            size={16}
            fill="dark"
            className="me-1"
            ariaLabel={t("Dispositif.phone", "Téléphone")}
          />
          <span>{marker.phone}</span>
        </p>
      )}
      {safeDescription && (
        <p className={styles.info}>
          <EVAIcon
            name="clock-outline"
            size={16}
            fill="dark"
            className="me-1"
            ariaLabel={t("Dispositif.schedule", "Horaires")}
          />
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
