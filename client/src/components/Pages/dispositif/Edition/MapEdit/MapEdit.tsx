import { useCallback, useContext, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import Image from "next/image";
import { CreateDispositifRequest, Poi } from "@refugies-info/api-types";
import PageContext from "utils/pageContext";
import AddContentButton from "../AddContentButton";
import DeleteModal from "./DeleteModal";
import Header from "./Header";
import PoiForm from "./PoiForm";
import Sidebar from "./Sidebar";
import MapIcon from "assets/dispositif/map-icon.png";
import styles from "./MapEdit.module.scss";

export type Marker = Poi & { id: number };

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

const MapEdit = () => {
  const { setValue } = useFormContext<CreateDispositifRequest>();
  const markers: CreateDispositifRequest["map"] = useWatch({ name: "map" });
  const { setActiveSection } = useContext(PageContext);

  const [hasMap, setHasMap] = useState((markers || []).length > 0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState((markers || []).length > 0);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [poiForm, setPoiForm] = useState<Partial<Poi> | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    if (hasMap || poiForm) {
      setActiveSection?.("map");
    }
  }, [hasMap, poiForm, setActiveSection]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new google.maps.LatLngBounds();
      if (!markers || markers.length === 0) {
        bounds.extend(new google.maps.LatLng(48.856614, 2.3522219));
      } else {
        for (const marker of markers || []) {
          if (!!marker.lat && !!marker.lng) {
            bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
          }
        }
      }

      map.fitBounds(bounds);
      setMap(map);
    },
    [markers],
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  /**
   * Click marker on map
   */
  const selectMarker = useCallback(
    (i: number) => {
      if (!markers) return;
      setSelectedMarker(i);
      const marker = markers[i];
      if (marker && marker.lat && marker.lng) {
        setPoiForm(marker);
        setShowSidebar(false);
        map?.setCenter({ lat: marker.lat, lng: marker.lng });
      }
    },
    [map, markers],
  );

  /**
   * Select place from suggestions
   */
  const onSelectPlace = useCallback((place: google.maps.places.PlaceResult | null) => {
    if (!place) return;
    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();
    if (lat && lng) {
      const newMarker: Poi = {
        title: "",
        address: place.formatted_address || "",
        city: place.address_components?.find((c) => c.types.includes("locality"))?.short_name || "",
        lat,
        lng,
      };
      setSelectedMarker(null);
      setPoiForm(newMarker);
      setShowSidebar(false);
    }
  }, []);

  /**
   * Validate POI form
   */
  const onValidateForm = useCallback(() => {
    if (!poiForm) return;
    const newMarkers = [...(markers || [])];
    const newPoi: Poi = {
      title: "",
      address: "",
      city: "",
      lat: 0,
      lng: 0,
      ...poiForm,
    };
    if (selectedMarker !== null) {
      newMarkers[selectedMarker] = newPoi; // edit
    } else {
      newMarkers.push(newPoi); // create
    }
    setValue("map", newMarkers);
    setSelectedMarker(null);
    setPoiForm(null);
    setShowSidebar(true);
  }, [poiForm, setValue, markers, selectedMarker]);

  const deleteMarker = useCallback(
    (key: number) => {
      const newMarkers = [...(markers || [])];
      newMarkers.splice(key, 1);
      setValue("map", newMarkers);
      setSelectedMarker(null);
      setPoiForm(null);
      setShowSidebar(newMarkers.length > 0);
    },
    [setValue, markers],
  );

  /**
   * Delete map section
   */
  const deleteMap = useCallback(() => {
    setValue("map", null);
    setHasMap(false);
    setSelectedMarker(null);
    setShowDeleteModal(false);
    setShowSidebar(false);
  }, [setValue]);

  return !hasMap ? (
    <AddContentButton onClick={() => setHasMap(true)} className="mb-8" optional>
      <span className={styles.add}>
        <Image src={MapIcon} width={48} height={32} alt="Map" className="me-4" />
        <span>Lieux d'accueil (optionnel)</span>
      </span>
    </AddContentButton>
  ) : (
    <div className={styles.container}>
      <Header onSelectPlace={onSelectPlace} onDelete={() => setShowDeleteModal(true)} />

      {showSidebar && <Sidebar markers={markers} onSelectMarker={selectMarker} selectedMarkerId={selectedMarker} />}
      {poiForm && (
        <PoiForm
          poiForm={poiForm}
          setPoiForm={setPoiForm}
          onValidate={onValidateForm}
          onClose={() => {
            setShowSidebar(true);
            setPoiForm(null);
          }}
          onDelete={selectedMarker !== null ? () => deleteMarker(selectedMarker) : undefined}
        />
      )}

      {isLoaded && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={5}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={() => setSelectedMarker(null)}
          clickableIcons={false}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            maxZoom: 12,
          }}
        >
          {(markers || []).map((marker, key) =>
            marker?.lat && marker?.lng ? (
              <MarkerF
                key={key}
                position={{
                  lat: marker.lat,
                  lng: marker.lng,
                }}
                icon={{
                  url: "/images/map/pin.svg",
                  anchor: new google.maps.Point(30, 42),
                }}
                onClick={() => selectMarker(key)}
              ></MarkerF>
            ) : null,
          )}
        </GoogleMap>
      )}

      <DeleteModal show={showDeleteModal} toggle={() => setShowDeleteModal((o) => !o)} onValidate={deleteMap} />
    </div>
  );
};

export default MapEdit;
