import type { Poi } from "@refugies-info/api-types";
import L from "leaflet";
import {
  Marker as LeafletMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.scss";
import PopupContent from "./PopupContent";

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

interface Props {
  markers: Marker[];
  popup: Marker | null;
  setPopup: (marker: Marker | null) => void;
  selectMarker: (marker: Marker) => void;
  setMap: (map: L.Map | null) => void;
}

const MapEvents = ({ setPopup }: { setPopup: (marker: Marker | null) => void }) => {
  useMapEvents({
    click: () => {
      setPopup(null);
    },
  });
  return null;
};

const DynamicMap = ({ markers, popup, setPopup, selectMarker, setMap }: Props) => {
  return (
    <MapContainer
      whenReady={() => setMap}
      style={{ width: "100%", height: "100%" }}
      center={markers.length === 0 ? [48.856614, 2.3522219] : undefined}
      zoom={5}
      attributionControl={false}
    >
      <TileLayer
        attribution='<a href="https://www.ign.fr/reperes/geodésie" target="_blank">IGN</a>'
        url="https://wxs.ign.fr/essentiels/geoportail/wmts?layer=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}"
      />
      <SetBounds markers={markers} />
      <MapEvents setPopup={setPopup} />
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
  );
};

export default DynamicMap;
