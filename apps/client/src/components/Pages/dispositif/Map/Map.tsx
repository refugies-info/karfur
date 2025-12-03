import type { Poi } from "@refugies-info/api-types";
import type L from "leaflet";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import styles from "./Map.module.scss";
import Sidebar from "./Sidebar";

export type Marker = Poi & { id: number };

const DynamicMap = dynamic(() => import("./DynamicMap"), { ssr: false });

const Map = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const [popup, setPopup] = useState<Marker | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  const markers = useMemo(() => {
    if (!dispositif?.map || dispositif.map?.length === 0) return [];
    return dispositif.map.map((marker, i) => ({ ...marker, id: i }));
  }, [dispositif]);

  const selectMarker = useCallback(
    (marker: Marker) => {
      setPopup(marker);
      map?.setView({ lat: marker.lat, lng: marker.lng });
      Event("DISPO_VIEW", "click marker", "Map");
    },
    [map],
  );

  return (
    <div className={styles.container}>
      <Sidebar
        markers={markers}
        onSelectMarker={selectMarker}
        selectedMarkerId={popup?.id || null}
      />
      <DynamicMap
        markers={markers}
        popup={popup}
        setPopup={setPopup}
        selectMarker={selectMarker}
        setMap={setMap}
      />
    </div>
  );
};

export default Map;
