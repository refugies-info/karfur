import React, { Component } from "react";
import moment from "moment";
import "moment/locale/fr";
import API from "utils/API";
import _ from "lodash";
import { targetByTag } from "./data";
import FButton from "components/UI/FButton/FButton";
import { NoGeolocModal } from "./NoGeolocModal";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import styles from "./Dashboard.module.scss";
import { tags } from "data/tags";

moment.locale("fr");

class Dashboard extends Component {
  state = {
    nbDispositifs: 0,
    nbDispositifsActifs: 0,
    nbDemarches: 0,
    nbDemarchesActives: 0,
    nbContributors: 0,
    nbDispositifsByMainTag: {},
    nbDemarchesByMainTag: {},
    nbTraductors: 0,
    figuresByRegion: [],
    showNoGeolocModal: false,
    isExportLoading: false,
  };

  componentDidMount() {
    API.count_dispositifs({ typeContenu: { $ne: "demarche" } }).then((data) =>
      this.setState({ nbDispositifs: data.data })
    );
    API.count_dispositifs({
      typeContenu: { $ne: "demarche" },
      status: "Actif",
    }).then((data) => this.setState({ nbDispositifsActifs: data.data }));
    API.count_dispositifs({ typeContenu: "demarche" }).then((data) =>
      this.setState({ nbDemarches: data.data })
    );
    API.count_dispositifs({
      typeContenu: "demarche",
      status: "Actif",
    }).then((data) => this.setState({ nbDemarchesActives: data.data }));

    API.getFiguresOnUsers().then((data) =>
      this.setState({
        nbContributors: data.data.data.nbContributors,
        nbTraductors: data.data.data.nbTraductors,
      })
    );

    API.getNbDispositifsByRegion().then((data) => {
      this.setState({
        figuresByRegion: data.data.data.regionFigures,
        dispositifsWithoutGeoloc: data.data.data.dispositifsWithoutGeoloc,
      });
    });

    tags.map((tag) => {
      API.count_dispositifs({
        "tags.0.name": tag.name,
        status: "Actif",
        typeContenu: "dispositif",
      }).then((data) => {
        this.setState({
          nbDispositifsByMainTag: {
            ...this.state.nbDispositifsByMainTag,
            [tag.name]: data.data,
          },
        });
      });

      API.count_dispositifs({
        "tags.0.name": tag.name,
        status: "Actif",
        typeContenu: "demarche",
      }).then((data) => {
        this.setState({
          nbDemarchesByMainTag: {
            ...this.state.nbDemarchesByMainTag,
            [tag.name]: data.data,
          },
        });
      });
    });
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  toggleNoGeolocModal = () =>
    this.setState((prevState) => ({
      showNoGeolocModal: !prevState.showNoGeolocModal,
    }));

  exportToAirtable = async () => {
    try {
      this.setState({ isExportLoading: true });
      await API.exportDispositifsGeolocalisation();
      this.setState({ isExportLoading: false });

      Swal.fire({
        title: "Yay...",
        text: "Export en cours",
        type: "success",
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: "Oh non!",
        text: "Something went wrong",
        type: "error",
        timer: 1500,
      });
    }
  };

  render() {
    const {
      nbDispositifs,
      nbDispositifsActifs,
      nbDemarches,
      nbDemarchesActives,
      nbContributors,
      nbTraductors,
      figuresByRegion,
      dispositifsWithoutGeoloc,
      showNoGeolocModal,
    } = this.state;
    const noGeolocFigures = figuresByRegion.filter(
      (data) => data.region === "No geoloc"
    );
    const franceFigures = figuresByRegion.filter(
      (data) => data.region === "France"
    );

    return (
      <div className={styles.container + " animated fadeIn"}>
        <div className="unformatted-data mb-10 ml-12">
          <NavLink to="backend/admin">Admin</NavLink>
          <ul>
            <b>
              Contenus par thème (nombre de dispositifs/démarches avec tag
              principal xxx (vs objectif)):
            </b>
            {Object.keys(this.state.nbDispositifsByMainTag).map((tag, key) => {
              const targetTag = _.find(targetByTag, { name: tag });
              const targetDispo =
                targetTag && targetTag.targetDispositif
                  ? targetTag.targetDispositif
                  : 0;

              const targetDemarche =
                targetTag && targetTag.targetDemarche
                  ? targetTag.targetDemarche
                  : 0;
              const currentValueDispositif = this.state.nbDispositifsByMainTag[
                tag
              ]
                ? this.state.nbDispositifsByMainTag[tag]
                : 0;

              const currentValueDemarche = this.state.nbDemarchesByMainTag[tag]
                ? this.state.nbDemarchesByMainTag[tag]
                : 0;
              const colorDispo =
                currentValueDispositif < targetDispo ? "red" : "green";
              const colorDemarche =
                currentValueDemarche < targetDemarche ? "red" : "green";
              return (
                <li key={key}>
                  {tag}{" "}
                  <b style={{ color: colorDispo }}>{currentValueDispositif}</b>
                  {""}/{targetDispo} -{" "}
                  <b style={{ color: colorDemarche }}>{currentValueDemarche}</b>
                  {""}/{targetDemarche}
                </li>
              );
            })}
            <br />
            <b>
              Géolocalisation des dispositifs par région (nombre de dispositifs
              - nombre de départements avec au moins 1 dispositif/nombre de
              départements) :
            </b>
            <FButton
              type="dark"
              className="ml-8"
              onClick={this.exportToAirtable}
            >
              Export départements airtable
            </FButton>
            {noGeolocFigures.length > 0 && (
              <li>
                <div
                  style={{
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  {`Pas d'infocard geoloc : ${noGeolocFigures[0].nbDispositifs} : `}
                  {noGeolocFigures[0].nbDispositifs > 0 && (
                    <FButton type="white" onClick={this.toggleNoGeolocModal}>
                      Voir les fiches
                    </FButton>
                  )}
                </div>
              </li>
            )}
            {franceFigures.length > 0 && (
              <li>{`France entière : ${franceFigures[0].nbDispositifs}`} </li>
            )}
            {figuresByRegion.map((data) => {
              if (data.region === "France" || data.region === "No geoloc")
                return;
              return (
                <li
                  key={data.region}
                >{`${data.region} : ${data.nbDispositifs} - ${data.nbDepartmentsWithDispo}/${data.nbDepartments}`}</li>
              );
            })}
            <br />
            <li>
              Nombre de dispositifs : <b>{nbDispositifs}</b>
            </li>
            <li>
              Nombre de dispositifs actifs : <b>{nbDispositifsActifs}</b>
            </li>
            <li>
              Nombre de démarches : <b>{nbDemarches}</b>
            </li>
            <li>
              Nombre de démarches actives : <b>{nbDemarchesActives}</b>
            </li>
            <li>
              Nombre de contributeurs : <b>{nbContributors}</b>
            </li>
            <li>
              Nombre de traducteurs ou experts : <b>{nbTraductors}</b>
            </li>
          </ul>
        </div>
        <NoGeolocModal
          dispositifsWithoutGeoloc={dispositifsWithoutGeoloc}
          show={showNoGeolocModal}
          toggle={this.toggleNoGeolocModal}
        />
      </div>
    );
  }
}

export default Dashboard;
