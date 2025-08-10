import { Poi } from "@refugies-info/api-types";
import L from "leaflet";
import { useCallback, useMemo, useState } from "react";
import { MapContainer, Marker as LeafletMarker, Popup, TileLayer, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import styles from "./Map.module.scss";
import PopupContent from "./PopupContent";
import Sidebar from "./Sidebar";

export type Marker = Poi & { id: number };

const pinIcon = new L.Icon({
  iconUrl: "/images/map/pin.svg",
  iconSize: [60, 42],
  iconAnchor: [30, 42],
});

const SetBounds = ({ markers }: { markers: Marker[] }) => {
  const map = useMap();
  if (markers.length > 0) {
    const bounds = new L.LatLngBounds(markers.map((m) => [m.lat, m.lng]));
    map.fitBounds(bounds);
  }
  return null;
};

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
      <Sidebar markers={markers} onSelectMarker={selectMarker} selectedMarkerId={popup?.id || null} />

      <MapContainer
        whenCreated={setMap}
        style={{ width: "100%", height: "100%" }}
        center={markers.length === 0 ? [48.856614, 2.3522219] : undefined}
        zoom={5}
        onclick={() => setPopup(null)}
        attributionControl={false}
      >
        <TileLayer
          attribution='<a href="https://www.ign.fr/reperes/geodésie" target="_blank">IGN</a>'
          url="https://wxs.ign.fr/essentiels/geoportail/wmts?layer=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}"
        />
        <SetBounds markers={markers} />
        {markers.map((marker, key) => (
          <LeafletMarker
            key={key}
            position={[marker.lat, marker.lng]}
            icon={pinIcon}
            eventHandlers={{
              click: () => {
                selectMarker(marker);
              },
            }}
          >
            {popup && popup.id === marker.id && (
              <Popup>
                <PopupContent marker={popup} onClose={() => setPopup(null)} />
              </Popup>
            )}
          </LeafletMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
