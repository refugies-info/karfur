import React, { PureComponent } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import _ from "lodash";
import ContentEditable from "react-contenteditable";
import Swal from "sweetalert2";
import { withTranslation } from "react-i18next";

import MapComponent from "../../../components/Frontend/Dispositif/MapComponent/MapComponent";
import MapModal from "../../../components/Modals/MapModal/MapModal";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
import { markerInfo } from "./data";

import "./MapParagraphe.scss";
import variables from "scss/colors.scss";

const refs = {};
class MapParagraphe extends PureComponent {
  state = {
    markers: [],
    isMarkerShown: [],
    showingInfoWindow: [],
    isDropdownOpen: false,
    dropdownValue: _.get(this.props.subitem.markers, "0.ville"),
    zoom: 5,
    center: { lat: 48.856614, lng: 2.3522219 },
    selectedMarker: -1,
    showModal: false,
    showSidebar: false,
    markerInfo: markerInfo,
    searchValue: "",
  };

  componentDidMount() {
    if (!this.props.disableEdit && !this.props.subitem.isMapLoaded) {
      // this.setState({showModal:true})
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.subitem.markers !== prevState.markers &&
      nextProps.subitem.markers.length > (prevState.markers || []).length
    ) {
      return {
        markers: nextProps.subitem.markers,
        isMarkerShown: new Array(nextProps.subitem.markers.length).fill(true),
        showingInfoWindow: new Array(nextProps.subitem.markers.length).fill(
          false
        ),
      };
    } else return null;
  }

  componentDidUpdate() {
    if (!this.props.disableEdit && !this.props.subitem.isMapLoaded) {
      // this.setState({showModal:true})
    }
  }

  onMapMounted = (ref) => (refs.map = ref);
  onSearchBoxMounted = (ref) => (refs.searchBox = ref);

  onPlacesChanged = () => {
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
    if (nextMarker.formatted_phone_number) {
      _.set(tempMarkerInfo, "5.value", nextMarker.formatted_phone_number);
    }

    this.setState({
      center: nextCenter,
      markers: [...this.state.markers, nextMarker],
      isMarkerShown: new Array(this.state.markers.length + 1).fill(true),
      showingInfoWindow: new Array(this.state.markers.length + 1).fill(false),
      showSidebar: true,
      selectedMarker: this.state.markers.length,
      zoom: 10,
      markerInfo: tempMarkerInfo,
      searchValue: "",
    });
  };

  handleMarkerClick = (e, marker, key) => {
    this.setState({
      showSidebar: true,
      markerInfo: this.state.markerInfo.map((x) =>
        marker[x.item] ? { ...x, value: marker[x.item] } : x
      ),
      zoom: 15,
      center: { lat: marker.latitude, lng: marker.longitude },
      // showingInfoWindow: this.state.showingInfoWindow.map((x, id) => id===key ? !x : false)
    });
  };

  handleChange = (e) => this.setState({ searchValue: e.target.value });

  onClose = () => {
    this.setState({
      showSidebar: false,
      markerInfo: markerInfo,
      // showingInfoWindow: new Array(this.state.markers.length).fill(false),
    });
  };

  toggleSidebar = () =>
    this.setState((pS) => ({ showSidebar: !pS.showSidebar }));
  toggleDropdown = () =>
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });

  toggleModal = () => {
    if (this.state.showModal) {
      this.props.disableIsMapLoaded(this.props.keyValue, this.props.subkey);
    }
    this.setState((prevState) => ({ showModal: !prevState.showModal }));
  };

  selectLocation = (key) => {
    this.setState({
      dropdownValue: this.state.markers[key].ville,
      zoom: 7,
      center: {
        lat: parseFloat(this.state.markers[key].latitude),
        lng: parseFloat(this.state.markers[key].longitude),
      },
      showingInfoWindow: this.state.showingInfoWindow.map(
        (x, id) => id === key
      ),
    });
  };

  handleFileLoaded = (csvArray) => {
    csvArray = csvArray.filter((x) => x.length > 1);
    let markers = [];
    if (csvArray && csvArray.length > 1 && csvArray[0].length > 1) {
      let headers = csvArray[0].filter((x) => x !== "");
      for (var i = 1; i < csvArray.length; i++) {
        let line = {};
        for (var j = 0; j < headers.length; j++) {
          line[headers[j].toLowerCase()] = csvArray[i][j];
        }
        markers.push(line);
      }
      this.setState({
        markers,
        isMarkerShown: new Array(markers.length).fill(true),
        showingInfoWindow: new Array(markers.length).fill(false),
        dropdownValue: markers[0].ville,
      });
    }
  };
  handleError = (e) => console.log(e);

  handleMarkerChange = (e, idx) =>
    this.setState({
      markerInfo: this.state.markerInfo.map((x, i) =>
        i === idx ? { ...x, value: e.target.value } : x
      ),
    });

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
    if (
      (!this.state.markerInfo[4].value ||
        this.state.markerInfo[4].value === "ajouter@votreemail.fr") &&
      (!this.state.markerInfo[5].value ||
        this.state.markerInfo[5].value === "00 11 22 33 44")
    ) {
      Swal.fire({
        title: "Oh non!",
        text:
          "Vous devez renseigner au moins une information de contact (email ou téléphone)",
        type: "error",
        timer: 1500,
      });
      return;
    }
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
    this.props.setMarkers(markers, this.props.keyValue, this.props.subkey);
    this.setState({
      markers: markers,
      showSidebar: false,
      dropdownValue: markers[this.state.selectedMarker].nom,
    });
  };

  render() {
    const { markers, markerInfo } = this.state;
    const { t, disableEdit } = this.props;
    return (
      <div className="map-paragraphe" id="map-paragraphe">
        <div className="where-header backgroundColor-darkColor">
          <div>
            <EVAIcon name="pin-outline" className="mr-10" />
            <b>
              {t(
                "Dispositif.Trouver un interlocuteur",
                "Trouver un interlocuteur"
              )}{" "}
              :{" "}
            </b>
          </div>
          {markers.length > 0 && (
            <ButtonDropdown
              isOpen={this.state.isDropdownOpen}
              toggle={this.toggleDropdown}
              className="content-title"
            >
              <DropdownToggle
                caret
                color="transparent"
                className="dropdown-btn"
              >
                <span>{this.state.dropdownValue}</span>
              </DropdownToggle>
              <DropdownMenu>
                {markers.map((marker, key) => (
                  <DropdownItem
                    key={key}
                    onClick={() => this.selectLocation(key)}
                  >
                    {marker.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </ButtonDropdown>
          )}
          {!disableEdit && (
            <EVAIcon
              onClick={() =>
                this.props.deleteCard(this.props.keyValue, this.props.subkey)
              }
              name="close-circle"
              fill={variables.error}
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

        <MapModal
          showModal={this.state.showModal}
          toggleModal={this.toggleModal}
          handleFileLoaded={this.handleFileLoaded}
          handleError={this.handleError}
        />
      </div>
    );
  }
}

export default withTranslation()(MapParagraphe);
