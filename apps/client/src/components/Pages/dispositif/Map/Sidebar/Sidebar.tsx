import { useTranslation } from "next-i18next";
import { useState } from "react";
import Button from "~/components/UI/Button";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { cls } from "~/lib/classname";
import { Marker } from "../Map";
import styles from "./Sidebar.module.scss";

interface Props {
  markers: Marker[];
  onSelectMarker: (marker: Marker) => void;
  selectedMarkerId: number | null;
}

const Sidebar = ({ markers, onSelectMarker, selectedMarkerId }: Props) => {
  const { t } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className={cls(styles.sidebar, !showSidebar && styles.hidden)}>
      <div className={styles.list}>
        {markers.map((marker, i) => (
          <span key={i}>
            <button
              className={cls(styles.item, selectedMarkerId === marker.id && styles.active)}
              onClick={(e: any) => {
                e.preventDefault();
                onSelectMarker(marker);
              }}
            >
              <p className={styles.title}>{marker.title}</p>
              <p className={styles.city}>
                <EVAIcon name="pin-outline" fill="black" size={16} className="me-2" />À {marker.city}
              </p>
            </button>
            <span className={styles.divider} />
          </span>
        ))}
      </div>
      <Button
        priority="tertiary"
        evaIcon={showSidebar ? "chevron-left" : "chevron-right"}
        className={cls("ms-2 mt-2 p-2", styles.btn)}
        onClick={(e: any) => {
          e.preventDefault();
          setShowSidebar((o) => !o);
        }}
        iconPosition="right"
      >
        {!showSidebar && t("Dispositif.mapPinList")}
      </Button>
    </div>
  );
};

export default Sidebar;
