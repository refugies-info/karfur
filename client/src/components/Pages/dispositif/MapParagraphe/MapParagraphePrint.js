import React, { PureComponent } from "react";
import _ from "lodash";
import { withTranslation } from "react-i18next";
import { Table } from "reactstrap";

import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { markerInfo } from "data/dispositif";

// import "./MapParagraphe.scss";

class MapParagraphe extends PureComponent {
  state = {
    markers: [],
    isMarkerShown: [],
    showingInfoWindow: [],
    isDropdownOpen: false,
    dropdownValue: _.get(this.props.subitem.markers, "0.ville"),
    zoom: 5,
    center: { lat: 48.856614, lng: 2.3522219 },
    selectedMarker: 0,
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

  render() {
    const { markerInfo } = this.state;
    const { t } = this.props;
    return (
      <div
        className="map-paragraphe page-break"
        id="map-paragraphe"
        onMouseEnter={() => this.props.updateUIArray(-5)}
      >
        <div className="where-header" style={{backgroundColor: (this.props.mainTag && this.props.mainTag.darkColor) ? this.props.mainTag.darkColor : "#000000"}}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 1,
              alignItems: "center",
            }}
          >
            <div style={{ marginLeft: 30, marginBottom: 10 }}>
              <EVAIcon name="pin-outline" className="mr-10" />
              <b>
                {t(
                  "Dispositif.Trouver un interlocuteur",
                  "Trouver un interlocuteur"
                )}{" "}
                :{" "}
              </b>
            </div>
            <Table responsive className="avancement-user-table">
              <thead>
                <tr>
                  {markerInfo.map((element, key) => (
                    <th key={key}>{element.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.props.subitem.markers.map((element, key) => {
                  return (
                    <tr key={key}>
                      <td className="align-middle">{element.name}</td>
                      <td className="align-middle negative-margin">
                        {element.adresse}
                      </td>
                      <td className="align-middle fit-content">
                        {element.ville}
                      </td>
                      <td className="align-middle fit-content">
                        {element.description === "" ? "Non renseigné" : element.description }
                      </td>
                      <td className="align-middle">
                        {!element.email ||
                        element.email === "ajouter@votreemail.fr" ||
                        element.email === "Non renseigné" ||
                        element.email === ""
                          ? "Non renseigné"
                          : element.email}
                      </td>
                      <td className="align-middle ">
                        {!element.telephone ||
                        element.telephone === "00 11 22 33 44" ||
                        element.telephone === "Non renseigné" ||
                        element.telephone === ""
                          ? "Non renseigné"
                          : element.telephone}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(MapParagraphe);
