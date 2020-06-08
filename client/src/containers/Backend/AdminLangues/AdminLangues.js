import React, { Component } from "react";
import track from "react-tracking";
import { Col, Row, Button, Progress } from "reactstrap";
import { stringify } from "himalaya";

import API from "../../../utils/API";
import marioProfile from "../../../assets/mario-profile.jpg";
import { colorAvancement } from "../../../components/Functions/ColorFunctions";
import CustomAccordion from "../../../components/Backend/AdminLangues/CustomAccordion/CustomAccordion";
import Leaderboard from "../../../components/Backend/AdminLangues/Leaderboard/Leaderboard";
import AvancementTable from "../../../components/Translation/Avancement/AvancementTable";
import Widget01 from "../../../components/Widgets/Widget01";

import "./AdminLangues.scss";

const avancement_data = {
  title: "Progression des langues",
  headers: [
    "Drapeau",
    "Langue",
    "Avancement",
    "Traducteurs actifs",
    "Traduction rapide",
    "Voir les thèmes",
  ],
};

const tickets_data = {
  title: "Tickets",
  badge: "12",
  headers: [
    { title: "Urgents", badge: 2, color: "danger" },
    { title: "Importants", badge: 4, color: "warning" },
    { title: "A traiter", badge: 6, color: "info" },
  ],
};

const reviews_data = {
  title: "Reviews",
  badge: "12",
  headers: [
    { title: "Critiques", badge: 1, color: "danger" },
    { title: "Importants", badge: 3, color: "warning" },
    { title: "A traiter", badge: 8, color: "info" },
  ],
};

const languesSize = 3;

class AdminLangues extends Component {
  state = {
    langues: [],
    themes: [],
    traductions: [],
    currentTraduction: {},
    accordion: {
      Tickets: [false, false, false],
      Reviews: [false, false, false],
    },
    reviews_data: reviews_data,
  };

  componentDidMount() {
    API.get_langues(
      {},
      { avancement: 1 },
      { path: "participants", select: "-password" }
    ).then(
      (data_res) => {
        this.setState({
          langues: data_res.data.data.filter(
            (el) => el.langueFr !== "Français"
          ),
        });
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        return;
      }
    );

    API.get_themes(
      {},
      { avancement: 1 },
      { path: "participants", select: "-password" }
    ).then(
      (data_res) => {
        this.setState({
          themes: data_res.data.data,
        });
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        return;
      }
    );

    API.get_tradForReview({
      query: { rightId: { $ne: null }, status: "En attente" },
      sort: { langueCible: 1 },
      populate: { path: "userId", select: "-password" },
    }).then(
      (data_res) => {
        if (data_res.data.data.length > 0) {
          let traductions = data_res.data.data.map((x) => {
            return {
              ...x,
              initialText: stringify(x.initialText),
              translatedText: stringify(x.translatedText),
            };
          });
          this.setState({
            traductions: traductions,
            currentTraduction: traductions[0],
            reviews_data: {
              ...this.state.reviews_data,
              badge: traductions.length,
              headers: [
                ...this.state.reviews_data.headers.map((x) => {
                  return { ...x, badge: traductions.length };
                }),
              ],
            },
          });
        }
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        return;
      }
    );
  }

  toggleAccordion = (tab, item) => {
    const state = [
      ...this.state.accordion[item].map((x, index) =>
        tab === index ? !x : false
      ),
    ];
    this.setState({
      accordion: {
        ...this.state.accordion,
        [item]: state,
      },
    });
  };

  onValidate = () => {
    API.validate_tradForReview(this.state.currentTraduction).then(
      () => {
        this.onPass();
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        return;
      }
    );
  };

  onPass = () => {
    let lastIndex = this.state.traductions.findIndex(
      (k) => k._id === this.state.currentTraduction._id
    );
    if (lastIndex > -1) {
      this.setState({
        currentTraduction:
          lastIndex > this.state.traductions.length - 1
            ? this.state.traductions[this.state.reviews_data + 1]
            : this.state.traductions[0],
        reviews_data: {
          ...this.state.reviews_data,
          badge: this.state.reviews_data.badge - 1,
          headers: [
            ...this.state.reviews_data.headers.map((x) => {
              return { ...x, badge: x.badge - 1 };
            }),
          ],
        },
      });
    } else {
      // eslint-disable-next-line no-console
      console.log("no index");
    }
  };

  render() {
    return (
      <div className="admin-langues animated fadeIn">
        <Row>
          <AvancementTable
            headers={avancement_data.headers}
            title={avancement_data.title}
            data={this.state.langues}
          >
            {this.state.langues.slice(0, languesSize).map((langue) => {
              return (
                <tr key={langue._id} onClick={this.navigateToDashLang}>
                  <td className="align-middle">
                    <i
                      className={
                        "flag-icon flag-icon-" + langue.langueCode + " h1"
                      }
                      title={langue.langueCode}
                      id={langue.langueCode}
                    ></i>
                  </td>
                  <td className="align-middle">{langue.langueFr}</td>
                  <td className="align-middle">
                    <div>{Math.round((langue.avancement || 0) * 100)} %</div>
                    <Progress
                      color={colorAvancement(langue.avancement)}
                      value={langue.avancement * 100}
                    />
                  </td>
                  <td className="align-middle limit-width-340">
                    <Row className="limit-width-340">
                      <Col md="12">
                        {langue.participants.map((participant, key) => {
                          return (
                            <img
                              key={(participant.picture || {}).imgId || key}
                              src={
                                (participant.picture || {}).secure_url ||
                                marioProfile
                              }
                              className="profile-img-pin img-circle"
                              alt="random profiles"
                            />
                          );
                        })}
                      </Col>
                    </Row>
                  </td>
                  <td className="align-middle">
                    <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                      <Button block color="success">
                        Accès rapide
                      </Button>
                    </Col>
                  </td>
                  <td className="align-middle">
                    <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                      <Button block color="info">
                        Voir les thèmes
                      </Button>
                    </Col>
                  </td>
                </tr>
              );
            })}
          </AvancementTable>
        </Row>

        <Row>
          <Col xl="6">
            <CustomAccordion
              data={tickets_data}
              accordion={this.state.accordion.Tickets}
              toggleAccordion={this.toggleAccordion}
            />
          </Col>
          <Col xl="6">
            <CustomAccordion
              data={this.state.reviews_data}
              accordion={this.state.accordion.Reviews}
              toggleAccordion={this.toggleAccordion}
              traduction={this.state.currentTraduction}
              onValidate={this.onValidate}
              onPass={this.onPass}
            />
          </Col>
        </Row>

        <Row className="classement">
          <Col xl="6">
            <Leaderboard />
          </Col>

          <Col xl="6">
            <Row>
              {this.state.themes.slice(0, 9).map((theme) => {
                let avancement = Math.random();
                let nbMots = Math.floor(Math.random() * Math.floor(10000));
                let nbParticipants = (theme.participants || []).length;
                return (
                  <Col
                    xs="12"
                    sm="6"
                    md="4"
                    className="no-padding"
                    key={theme._id}
                  >
                    <Widget01
                      color={colorAvancement(avancement)}
                      variant="inverse"
                      value={"" + avancement * 100}
                      header={theme.themeNom}
                      mainText={
                        Math.floor(avancement * nbMots) +
                        " / " +
                        nbMots +
                        " mots"
                      }
                      smallText={
                        nbParticipants +
                        " contributeur" +
                        (nbParticipants > 1 && "s")
                      }
                    />
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default track({
  page: "AdminLangues",
})(AdminLangues);
