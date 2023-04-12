import React from "react";
import { CreateDispositifRequest } from "api-types";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./Sidebar.module.scss";

interface Props {
  markers: CreateDispositifRequest["map"];
  onSelectMarker: (key: number) => void;
  selectedMarkerId: number | null;
}

const Sidebar = ({ markers, onSelectMarker, selectedMarkerId }: Props) => {
  return (
    <div className={cls(styles.sidebar)}>
      <div className={styles.list}>
        {(markers || []).map((marker, i) => (
          <span key={i}>
            <button
              className={cls(styles.item, selectedMarkerId === i && styles.active)}
              onClick={() => onSelectMarker(i)}
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
    </div>
  );
};

export default Sidebar;
