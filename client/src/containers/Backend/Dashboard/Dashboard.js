import React, { Component } from "react";
import moment from "moment/min/moment-with-locales";
import { connect } from "react-redux";
import API from "../../../utils/API";
import "./Dashboard.scss";
import { filtres } from "../../Dispositif/data";
import _ from "lodash";
import { targetByTag } from "./data";

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

    filtres.tags.map((tag) => {
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
        demarcheId: { $exists: false },
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

  render() {
    const {
      nbDispositifs,
      nbDispositifsActifs,
      nbDemarches,
      nbDemarchesActives,
      nbContributors,
      nbTraductors,
    } = this.state;
    return (
      <div className="dashboard-container animated fadeIn">
        <div className="unformatted-data mb-10 ml-12">
          <ul>
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
                  Nombre de dispositifs/démarches avec tag principal{" "}
                  <b>{tag}</b> (vs objectif) :{" "}
                  <b style={{ color: colorDispo }}>{currentValueDispositif}</b>
                  {""}/{targetDispo} -{" "}
                  <b style={{ color: colorDemarche }}>{currentValueDemarche}</b>
                  {""}/{targetDemarche}
                </li>
              );
            })}

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
      </div>
    );
  }
}

export default Dashboard;
