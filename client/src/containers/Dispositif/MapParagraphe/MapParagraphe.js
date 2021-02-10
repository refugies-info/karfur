/* eslint-disable no-console */
import React, { PureComponent } from "react";
import _ from "lodash";
import ContentEditable from "react-contenteditable";
import Swal from "sweetalert2";
import { withTranslation } from "react-i18next";

import MapComponent from "../../../components/Frontend/Dispositif/MapComponent/MapComponent";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import { markerInfo, markerInfoPlaceholders } from "./data";

import "./MapParagraphe.scss";
import { colors } from "colors";

const refs = {};
class MapParagraphe extends PureComponent {
  state = {
    markers: [],
    isMarkerShown: [],
    isDropdownOpen: false,
    dropdownValue: _.get(this.props.subitem.markers, "0.ville"),
    zoom: 5,
    center: { lat: 48.856614, lng: 2.3522219 },
    selectedMarker: 0,
    showSidebar: false,
    markerInfo: markerInfo,
    searchValue: "",
    selectedMarkerId: "",
  };

  componentDidMount() {
    if (!this.props.disableEdit && !this.props.subitem.isMapLoaded) {
    }
    this.props.showMapButton(false);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.subitem.markers !== prevState.markers &&
      nextProps.subitem.markers.length > (prevState.markers || []).length
    ) {
      return {
        markers: nextProps.subitem.markers,
        isMarkerShown: new Array(nextProps.subitem.markers.length).fill(true),
      };
    }
    return null;
  }

  onMapMounted = (ref) => (refs.map = ref);
  onSearchBoxMounted = (ref) => (refs.searchBox = ref);

  onPlacesChanged = () => {
    console.log("onPlacesChanged");
    this.setState((pS) => ({
      markers: pS.markers.filter((x) =>
        this.props.subitem.markers.some((y) => y.gid === x.gid)
      ),
    })); //J'enlève tous les markers qui ont pas été validés
    const place = _.get(refs.searchBox.getPlaces(), "0", {});
    const nextMarker = {
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      address: place.formatted_address,
      name: place.name,
      address_components: place.address_components,
      adr_address: place.adr_address,
      vicinity: place.vicinity,
      opening_hours: place.opening_hours,
      formatted_phone_number: place.formatted_phone_number,
      international_phone_number: place.international_phone_number,
      position: place.geometry.location,
      gid: place.id,
      place_id: place.place_id,
    };
    const nextCenter = _.get(nextMarker, "position", this.state.center);
    let tempMarkerInfo = [...this.state.markerInfo];

    if (nextMarker.name) {
      _.set(tempMarkerInfo, "0.value", nextMarker.name);
    }
    _.set(tempMarkerInfo, "1.value", nextMarker.address);
    _.set(tempMarkerInfo, "2.value", nextMarker.vicinity);

    this.setState({
      center: nextCenter,
      markers: [...this.state.markers, nextMarker],
      isMarkerShown: new Array(this.state.markers.length + 1).fill(true),
      showSidebar: true,
      selectedMarker: this.state.markers.length,
      selectedMarkerId: place.place_id,
      zoom: 10,
      markerInfo: tempMarkerInfo,
      searchValue: "",
    });
  };

  handleMarkerClick = (_, marker) => {
    console.log("handle marker click", marker);
    this.setState({
      showSidebar: true,
      markerInfo: this.state.markerInfo.map((x) =>
        marker[x.item] ? { ...x, value: marker[x.item] } : x
      ),
      zoom: 15,
      center: { lat: marker.latitude, lng: marker.longitude },
      selectedMarkerId: marker.place_id,
    });
  };

  handleChange = (e) => this.setState({ searchValue: e.target.value });

  onClose = () => {
    this.setState({
      showSidebar: false,
      markerInfo: markerInfo,
    });
  };

  toggleSidebar = () =>
    this.setState((pS) => ({ showSidebar: !pS.showSidebar }));
  toggleDropdown = () =>
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });

  selectLocation = (key) => {
    this.setState({
      dropdownValue: this.state.markers[key].ville,
      zoom: 7,
      center: {
        lat: parseFloat(this.state.markers[key].latitude),
        lng: parseFloat(this.state.markers[key].longitude),
      },
    });
  };

  handleMarkerChange = (e, idx) => {
    console.log("handle marker change", e.target.value, idx);
    console.log(
      "new state",
      this.state.markerInfo.map((x, i) =>
        i === idx ? { ...x, value: e.target.value } : x
      )
    );
    this.setState({
      markerInfo: this.state.markerInfo.map((x, i) =>
        i === idx ? { ...x, value: e.target.value } : x
      ),
    });
  };

  validateMarker = () => {
    if (
      !this.state.markerInfo[0].value ||
      this.state.markerInfo[0].value === "Saisir le titre" ||
      this.state.markerInfo[4].value === "00 11 22 33 44"
    ) {
      Swal.fire({
        title: "Oh non!",
        text: "Vous devez renseigner un titre de lieu pour ce marqueur",
        type: "error",
        timer: 1500,
      });
      return;
    }
    console.log(
      "validate marker this.state.selectedMarker",
      this.state.selectedMarker,
      this.state.selectedMarkerId
    );

    //     const correspondingMarkerArray = this.state.markers.filter(
    //       (marker) => marker.place_id === this.state.selectedMarkerId
    //     );

    //     const correspondingMarker =
    //       correspondingMarkerArray.length > 0 ? correspondingMarkerArray[0] : null;
    //       let markers = [...this.state.markers];
    // if(correspondingMarker){

    // }

    const newMarkers = this.state.markers.map((marker) => {
      if (marker.place_id === this.state.selectedMarkerId) {
        return {
          ...marker,
          ...this.state.markerInfo.reduce(
            (accumulateur, valeurCourante) => ({
              ...accumulateur,
              [valeurCourante.item]: valeurCourante.value,
            }),
            {}
          ),
        };
      }
      return marker;
    });

    let markers = [...this.state.markers];
    markers[this.state.selectedMarker] = {
      ...markers[this.state.selectedMarker],
      ...this.state.markerInfo.reduce(
        (accumulateur, valeurCourante) => ({
          ...accumulateur,
          [valeurCourante.item]: valeurCourante.value,
        }),
        {}
      ),
    };

    console.log("new markers", newMarkers);

    this.props.setMarkers(newMarkers, this.props.keyValue, this.props.subkey);
    this.setState({
      markers: markers,
      showSidebar: false,
      dropdownValue: markers[this.state.selectedMarker].nom,
    });
  };

  render() {
    const { markers, markerInfo } = this.state;
    const { t, disableEdit } = this.props;
    console.log("markers", markers);
    // console.log("selected", this.state.selectedMarker);
    console.log("selectedId", this.state.selectedMarkerId);

    console.log("marker info", markerInfo);
    return (
      <div
        className="map-paragraphe"
        id="map-paragraphe"
        onMouseEnter={() => this.props.updateUIArray(-5)}
      >
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
              markers={markers || []}
              toggleDropdown={this.toggleDropdown}
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
              const placeholder = _.find(
                markerInfoPlaceholders,
                (category) => category.id === field.id
              ).placeholder;
              if (
                key === 3 &&
                (field.value ===
                  "Saisir des informations complémentaires si besoin" ||
                  field.value === "") &&
                disableEdit
              ) {
                return;
              } else if (
                ((key === 5 &&
                  (field.value === "00 11 22 33 44" ||
                    field.value === "Non renseigné" ||
                    field.value === "")) ||
                  (key === 4 &&
                    (field.value === "ajouter@votreemail.fr" ||
                      field.value === "Non renseigné" ||
                      field.value === ""))) &&
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
                      onChange={(e) => this.handleMarkerChange(e, key)}
                      className={
                        "marker-input color-darkColor " + field.customClass
                      }
                      placeholder="test"
                    />
                  </React.Fragment>
                );
                // eslint-disable-next-line
              } else {
                return (
                  <React.Fragment key={key}>
                    <label>
                      {t("Dispositif." + field.label, field.label)}
                      {field.mandatory && <sup>*</sup>}
                    </label>
                    <ContentEditable
                      html={field.value || ""}
                      disabled={disableEdit}
                      onChange={(e) => this.handleMarkerChange(e, key)}
                      className={
                        "marker-input color-darkColor " + field.customClass
                      }
                      placeholder={placeholder}
                    />
                  </React.Fragment>
                );
              }
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
