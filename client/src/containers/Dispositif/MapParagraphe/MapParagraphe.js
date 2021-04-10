import React, { PureComponent } from "react";
import _ from "lodash";
import ContentEditable from "react-contenteditable";
import Swal from "sweetalert2";
import { withTranslation } from "react-i18next";

import MapComponent from "../../../components/Frontend/Dispositif/MapComponent/MapComponent";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import { markerInfo } from "./data";
import { isMobile } from "react-device-detect";

import "./MapParagraphe.scss";
import { colors } from "colors";

const refs = {};
class MapParagraphe extends PureComponent {
  state = {
    zoom: 5,
    center: { lat: 48.856614, lng: 2.3522219 },
    selectedMarker: null,
    showSidebar: false,
    searchValue: "",
  };

  componentDidMount() {
    this.props.showMapButton(false);
  }

  onMapMounted = (ref) => (refs.map = ref);
  onSearchBoxMounted = (ref) => (refs.searchBox = ref);

  onPlacesChanged = () => {
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
    const nextCenter = _.get(nextMarker, "position", this.state.center);

    this.setState({
      center: nextCenter,
      selectedMarker: nextMarker,
      showSidebar: true,
      zoom: 10,
      searchValue: "",
    });
  };

  handleMarkerClick = (_, marker) => {
    this.setState({
      showSidebar: true,
      zoom: 15,
      center: { lat: marker.latitude, lng: marker.longitude },
      selectedMarker: marker,
    });
  };

  handleChange = (e) => this.setState({ searchValue: e.target.value });

  onClose = () => {
    this.setState({
      showSidebar: false,
      selectedMarker: null,
    });
  };

  toggleSidebar = () =>
    this.setState((pS) => ({ showSidebar: !pS.showSidebar }));

  selectLocation = (key) => {
    this.setState({
      zoom: 7,
      center: {
        lat: parseFloat(this.state.markers[key].latitude),
        lng: parseFloat(this.state.markers[key].longitude),
      },
    });
  };

  handleMarkerChange = (e, field) =>
    this.setState({
      selectedMarker: { ...this.state.selectedMarker, [field]: e.target.value },
    });

  validateMarker = () => {
    if (!this.state.selectedMarker || !this.state.selectedMarker.nom) {
      Swal.fire({
        title: "Oh non!",
        text: "Vous devez renseigner un titre de lieu pour ce marqueur",
        type: "error",
        timer: 1500,
      });
      return;
    }

    const isMarkerAlreadyInMarkers =
      this.props.subitem.markers.filter(
        (marker) => marker.place_id === this.state.selectedMarker.place_id
      ).length > 0;
    let newMarkers;

    if (isMarkerAlreadyInMarkers) {
      newMarkers = this.props.subitem.markers
        .filter(
          (marker) => marker.place_id !== this.state.selectedMarker.place_id
        )
        .concat([this.state.selectedMarker]);
    } else {
      newMarkers = this.props.subitem.markers.concat([
        this.state.selectedMarker,
      ]);
    }

    this.props.setMarkers(newMarkers, this.props.keyValue, this.props.subkey);
    this.setState({
      showSidebar: false,
      selectedMarker: null,
    });
  };

  render() {
    const { t, disableEdit } = this.props;
    const markersToDisplay = this.state.selectedMarker
      ? this.props.subitem.markers.concat([this.state.selectedMarker])
      : this.props.subitem.markers;
    return (
      <div
        className="map-paragraphe"
        id="map-paragraphe"
        onMouseEnter={() => this.props.updateUIArray(-5)}
      >
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
              className="ml-10"
              onClick={() => this.props.toggleShareContentOnMobileModal()}
            >
              {this.props.t("Dispositif.Partager Fiche", "Partager la Fiche")}
            </FButton>
          </div>
        )}
        <div className="where-header backgroundColor-darkColor">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
              alignItems: "center",
            }}
          >
            <div style={{ marginLeft: 30 }}>
              <EVAIcon name="pin-outline" className="mr-10" />
              <b>
                {t(
                  "Dispositif.Trouver un interlocuteur",
                  "Trouver un interlocuteur"
                )}{" "}
                :{" "}
              </b>
            </div>
            {!this.props.disableEdit && this.props.displayTuto && (
              <FButton
                type="tuto"
                name={"play-circle-outline"}
                onClick={() => this.props.toggleTutorielModal("Map")}
              >
                Tutoriel
              </FButton>
            )}
          </div>
          {!disableEdit && (
            <EVAIcon
              onClick={() =>
                this.props.deleteCard(
                  this.props.keyValue,
                  this.props.subkey,
                  "map"
                )
              }
              name="close-circle"
              fill={colors.error}
              size="xlarge"
              className="remove-btn"
            />
          )}
        </div>
        <div className="map-content">
          <div className="inner-container">
            <MapComponent
              onMarkerClick={this.handleMarkerClick}
              onClose={this.onClose}
              markers={markersToDisplay || []}
              onMapMounted={this.onMapMounted}
              onSearchBoxMounted={this.onSearchBoxMounted}
              onPlacesChanged={this.onPlacesChanged}
              disableEdit={disableEdit}
              handleChange={this.handleChange}
              {...this.state}
            />
          </div>
          <div
            className={
              "right-menu " +
              (this.state.showSidebar
                ? "slide-in-blurred-right"
                : "flip-out-ver-right")
            }
          >
            {markerInfo.map((field, key) => {
              const selectedMarker = this.state.selectedMarker;

              if (
                field.item === "description" &&
                selectedMarker &&
                (selectedMarker.description ===
                  "Saisir des informations complémentaires si besoin" ||
                  !selectedMarker.description) &&
                disableEdit
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
                disableEdit
              ) {
                return (
                  <React.Fragment key={key}>
                    <label>
                      {t("Dispositif." + field.label, field.label)}
                      {field.mandatory && <sup>*</sup>}
                    </label>
                    <ContentEditable
                      html={"Non renseigné" || ""}
                      disabled={disableEdit}
                      onChange={(e) => this.handleMarkerChange(e, field.item)}
                      className={
                        "marker-input color-darkColor " + field.customClass
                      }
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
                      disableEdit ||
                      ["vicinity", "address"].includes(field.item)
                    }
                    onChange={(e) => this.handleMarkerChange(e, field.item)}
                    className={
                      "marker-input color-darkColor " + field.customClass
                    }
                    placeholder={field.placeholder}
                  />
                </React.Fragment>
              );
            })}
            {!disableEdit && (
              <FButton
                onClick={this.validateMarker}
                type="theme"
                name="checkmark-circle-2-outline"
                className="validate-btn"
              >
                {t("Valider", "Valider")}
              </FButton>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(MapParagraphe);
