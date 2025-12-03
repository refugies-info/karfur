import type { CreateDispositifRequest, Poi } from "@refugies-info/api-types";
import { cn, Map } from "@refugies-info/ui";
import { useCallback, useContext, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import MapIcon from "~/assets/dispositif/map-icon.png";
import Image from "~/components/UI/Image";
import PageContext from "~/utils/pageContext";
import AddContentButton from "../AddContentButton";
import DeleteModal from "./DeleteModal";
import Header from "./Header";
import styles from "./MapEdit.module.scss";
import PoiForm from "./PoiForm";
import Sidebar from "./Sidebar";

export type Marker = Poi & { id: number };

const MapEdit = () => {
  const { setValue } = useFormContext<CreateDispositifRequest>();
  const markers: CreateDispositifRequest["map"] = useWatch({ name: "map" });
  const { setActiveSection } = useContext(PageContext);

  const [hasMap, setHasMap] = useState((markers || []).length > 0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState((markers || []).length > 0);

  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [poiForm, setPoiForm] = useState<Partial<Poi> | null>(null);
  const [focusLocation, setFocusLocation] = useState<
    ((poi: Poi, zoomLevel?: number) => void) | null
  >(null);

  useEffect(() => {
    if (hasMap || poiForm) {
      setActiveSection?.("map");
    }
  }, [hasMap, poiForm, setActiveSection]);

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
        if (focusLocation) {
          focusLocation(marker);
        }
      }
    },
    [focusLocation, markers],
  );

  /**
   * Select place from suggestions
   */
  const onSelectPlace = useCallback((place: any | null) => {
    if (!place) return;
    // Handle Nominatim result format
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    if (lat && lng) {
      const newMarker: Poi = {
        title: "",
        address: place.display_name || "",
        city: place.address?.city || place.address?.town || place.address?.village || "",
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

  // Handle map ready event to get the focusLocation function
  const handleMapReady = useCallback((fn: (poi: Poi, zoomLevel?: number) => void) => {
    setFocusLocation(() => fn);
    return fn;
  }, []);

  return !hasMap ? (
    <AddContentButton onClick={() => setHasMap(true)} className="mb-8" optional>
      <span className={styles.add}>
        <Image src={MapIcon} width={48} height={32} alt="Map" className="me-4" />
        <span>Lieux d'accueil (optionnel)</span>
      </span>
    </AddContentButton>
  ) : (
    <div
      className={cn(
        styles.container,
        "lg:shadow-ri relative grid grid-cols-3 grid-rows-[auto_1fr] gap-0 bg-white print:shadow-none",
      )}
    >
      <Header
        onSelectPlace={onSelectPlace}
        onDelete={() => setShowDeleteModal(true)}
        className="border-default-grey z-20 col-span-3 items-center border-b p-2"
      />

      {showSidebar && (
        <Sidebar
          markers={markers}
          onSelectMarker={selectMarker}
          selectedMarkerId={selectedMarker}
        />
      )}

      <div
        onClick={() => setSelectedMarker(null)}
        className="relative z-1 col-span-2 h-full w-full"
      >
        <Map
          mapData={markers || []}
          className="absolute inset-0 !shadow-none lg:h-full"
          title="Lieux d'accueil"
          defaultFocusedPoi={
            selectedMarker !== null && markers ? markers[selectedMarker] : undefined
          }
          showSidebar={false}
        />
      </div>

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

      <DeleteModal
        show={showDeleteModal}
        toggle={() => setShowDeleteModal((o) => !o)}
        onValidate={deleteMap}
      />
    </div>
  );
};

export default MapEdit;
