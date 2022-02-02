import React, { useEffect, useState } from "react";
import _ from "lodash";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import ContentEditable from "react-contenteditable";
import Swal from "sweetalert2";
import MapComponent from "components/Frontend/Dispositif/MapComponent/MapComponent";
import FButton from "components/FigmaUI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { markerInfo } from "data/markerInfo";
import { colors } from "colors";
import styled from "styled-components";
import styles from "./MapParagraphe.module.scss";
import { Tag } from "types/interface";

const StyledButton = styled.div`
  background-color: #8bc34a;
  height: 50px;
  display: flex;
  margin-top: 25px;
  flex-direction: column;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border-radius: 12px;
  color: #ffffff;
`;

const refs: any = {};
interface Props {
  showMapButton: (val: boolean) => void;
  disableEdit: boolean;
  displayTuto: boolean;
  updateUIArray: any;
  subitem: any;
  setMarkers: any;
  keyValue: number;
  subkey: number;
  toggleShareContentOnMobileModal: any;
  toggleTutorielModal: any;
  deleteCard: any;
  mainTag: Tag;
}
const MapParagraphe = (props: Props) => {
  const [center, setCenter] = useState({ lat: 48.856614, lng: 2.3522219 });
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { t } = useTranslation();

  const { showMapButton } = props;
  useEffect(() => {
    showMapButton(false);
  }, [showMapButton]);

  const onSearchBoxMounted = (ref: any) => (refs.searchBox = ref);

  const onPlacesChanged = () => {
    //J'enlève tous les markers qui ont pas été validés
    const place = _.get(refs.searchBox.getPlaces(), "0", {});
    const nextMarker = {
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      address: place.formatted_address,
      vicinity: place.vicinity,
      place_id: place.place_id,
      position: place.geometry.location,
    };
    const nextCenter = _.get(nextMarker, "position", center);

    setCenter(nextCenter);
    setSelectedMarker(nextMarker);
    setShowSidebar(true);
    setSearchValue("");
  };

  const handleMarkerClick = (_: any, marker: any) => {
    setShowSidebar(true);
    setCenter({ lat: marker.latitude, lng: marker.longitude });
    setSelectedMarker(marker);
  };

  const handleChange = (e: any) => setSearchValue(e.target.value);

  const onClose = () => {
    setShowSidebar(false);
    setSelectedMarker(null);
  };

  const handleMarkerChange = (e: any, field: string) =>
    setSelectedMarker({ ...selectedMarker, [field]: e.target.value });

  const validateMarker = () => {
    if (!selectedMarker || !selectedMarker.nom) {
      Swal.fire({
        title: "Oh non!",
        text: "Vous devez renseigner un titre de lieu pour ce marqueur",
        type: "error",
        timer: 1500,
      });
      return;
    }

    const isMarkerAlreadyInMarkers =
      props.subitem.markers.filter(
        (marker: any) => marker.place_id === selectedMarker.place_id
      ).length > 0;
    let newMarkers;

    if (isMarkerAlreadyInMarkers) {
      newMarkers = props.subitem.markers
        .filter((marker: any) => marker.place_id !== selectedMarker.place_id)
        .concat([selectedMarker]);
    } else {
      newMarkers = props.subitem.markers.concat([selectedMarker]);
    }

    props.setMarkers(newMarkers, props.keyValue, props.subkey);
    setShowSidebar(false);
    setSelectedMarker(null);
  };

  const deleteSelectedMarker = () => {
    const newMarkers = props.subitem.markers.filter(
      (marker: any) => marker.place_id !== selectedMarker.place_id
    );
    props.setMarkers(newMarkers, props.keyValue, props.subkey);
    setShowSidebar(false);
    setSelectedMarker(null);
  };

  const markersToDisplay = selectedMarker
    ? props.subitem.markers.concat([selectedMarker])
    : props.subitem.markers;
  return (
    <div
      className={styles.map}
      id="map-paragraphe"
      onMouseEnter={() => props.updateUIArray(-5)}
    >
      {(markersToDisplay.length || !props.disableEdit) && (
        <div>
          {isMobile && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: -30,
                marginBottom: 20,
              }}
            >
              <FButton
                type="outline-black"
                name={"share-outline"}
                onClick={props.toggleShareContentOnMobileModal}
              >
                {t("Dispositif.Partager Fiche", "Partager la fiche")}
              </FButton>
            </div>
          )}
          <div
            className={styles.header}
            style={{backgroundColor: props.mainTag.darkColor}}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                alignItems: "center",
              }}
            >
              <div style={{ marginLeft: isMobile ? 6 : 30 }}>
                <EVAIcon name="pin-outline" className="mr-10" />
                <b>
                  {t(
                    "Dispositif.Trouver un interlocuteur",
                    "Trouver un interlocuteur"
                  )}{" "}
                  :{" "}
                </b>
              </div>
              {!props.disableEdit && props.displayTuto && (
                <FButton
                  type="tuto"
                  name={"play-circle-outline"}
                  onClick={() => props.toggleTutorielModal("Map")}
                >
                  Tutoriel
                </FButton>
              )}
            </div>
            {!props.disableEdit && (
              <EVAIcon
                onClick={() =>
                  props.deleteCard(props.keyValue, props.subkey, "map")
                }
                name="close-circle"
                fill={colors.error}
                size="xlarge"
                className={styles.remove_btn}
              />
            )}
          </div>
          <div className={styles.map_content}>
            <div className={styles.container}>
              <MapComponent
                onMarkerClick={handleMarkerClick}
                onClose={onClose}
                markers={markersToDisplay || []}
                onSearchBoxMounted={onSearchBoxMounted}
                onPlacesChanged={onPlacesChanged}
                disableEdit={props.disableEdit}
                handleChange={handleChange}
                searchValue={searchValue}
              />
            </div>

            <div
              className={`${styles.right_menu} ${
                showSidebar ? styles.slide : styles.flip
              }`}
            >
              {markerInfo.map((field, key) => {
                if (
                  field.item === "description" &&
                  selectedMarker &&
                  (selectedMarker.description ===
                    "Saisir des informations complémentaires si besoin" ||
                    !selectedMarker.description) &&
                  props.disableEdit
                ) {
                  return;
                } else if (
                  ((field.item === "telephone" &&
                    selectedMarker &&
                    (!selectedMarker.telephone ||
                      selectedMarker.telephone === "00 11 22 33 44" ||
                      selectedMarker.telephone === "Non renseigné")) ||
                    (key === 4 &&
                      selectedMarker &&
                      (!selectedMarker.email ||
                        selectedMarker.email === "ajouter@votreemail.fr" ||
                        selectedMarker.email === "Non renseigné"))) &&
                  props.disableEdit
                ) {
                  return (
                    <React.Fragment key={key}>
                      <label>
                        {t("Dispositif." + field.label, field.label)}
                        {field.mandatory && <sup>*</sup>}
                      </label>
                      <ContentEditable
                        html={"Non renseigné" || ""}
                        disabled={props.disableEdit}
                        onChange={(e) => handleMarkerChange(e, field.item)}
                        className={styles.marker_input + " " +field.customClass}
                        style={{color: props.mainTag.darkColor}}
                        placeholder="test"
                      />
                    </React.Fragment>
                  );
                }
                return (
                  <React.Fragment key={key}>
                    <label>
                      {t("Dispositif." + field.label, field.label)}
                      {field.mandatory && <sup>*</sup>}
                    </label>
                    <ContentEditable
                      html={
                        selectedMarker && selectedMarker[field.item]
                          ? selectedMarker[field.item]
                          : ""
                      }
                      disabled={
                        props.disableEdit ||
                        ["vicinity", "address"].includes(field.item)
                      }
                      onChange={(e) => handleMarkerChange(e, field.item)}
                      className={styles.marker_input + "  " + field.customClass}
                      style={{color: props.mainTag.darkColor}}
                      placeholder={field.placeholder}
                    />
                  </React.Fragment>
                );
              })}
              {!props.disableEdit && (
                <>
                  <FButton
                    onClick={deleteSelectedMarker}
                    type="error"
                    name="trash"
                    className={styles.delete_btn}
                  >
                    Supprimer
                  </FButton>
                  <FButton
                    onClick={validateMarker}
                    type="theme"
                    name="checkmark-circle-2-outline"
                    className={styles.validate_btn}
                  >
                    {t("Valider", "Valider")}
                  </FButton>
                </>
              )}
              {isMobile && (
                <StyledButton onClick={onClose}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <EVAIcon name="checkmark" className="mr-10" />
                    {t("Ok", "Ok")}
                  </div>
                </StyledButton>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapParagraphe;
