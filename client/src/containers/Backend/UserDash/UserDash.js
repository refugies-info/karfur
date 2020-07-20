import React, { Component } from "react";
import track from "react-tracking";
import { Col, Row, Progress, Table, Modal, Spinner } from "reactstrap";
import ReactJoyride from "react-joyride";
import moment from "moment/min/moment-with-locales";
import Swal from "sweetalert2";
import Icon from "react-eva-icons";
import { connect } from "react-redux";

import marioProfile from "../../../assets/mario-profile.jpg";
import { steps, avancement_langue, avancement_data } from "./data";
import { colorAvancement } from "../../../components/Functions/ColorFunctions";
import API from "../../../utils/API";
import DashHeader from "../../../components/Backend/UserDash/DashHeader/DashHeader";
import { ObjectifsModal, TraducteurModal } from "../../../components/Modals";
import { TradTable } from "../../../components/Backend/UserProfile";
import FButton from "../../../components/FigmaUI/FButton/FButton";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";

import "./UserDash.scss";
import variables from "scss/colors.scss";

moment.locale("fr");

// Espace traduction
export class UserDash extends Component {
  state = {
    showModal: {
      objectifs: false,
      traducteur: false,
      progression: false,
      defineUser: false,
    },
    runJoyRide: false, //penser à le réactiver !!
    user: {},
    languesUser: [],
    traductionsFaites: [],
    progression: {
      timeSpent: 0,
      nbMots: 0,
    },
    isMainLoading: true,
    showSections: { traductions: true },
    tradsForReview: [],
  };
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    let user = this.props.user;
    if (user && user.selectedLanguages && user.selectedLanguages.length > 0) {
      API.get_langues(
        { _id: { $in: user.selectedLanguages } },
        { avancement: 1 },
        "participants"
      ).then((data_langues) => {
        const languesUser = data_langues.data.data;
        this._isMounted &&
          this.setState({ languesUser, isMainLoading: false }, () => {
            if (this.props.expertTrad) {
              this._isMounted &&
                API.get_tradForReview({
                  query: {
                    langueCible: {
                      $in: this.state.languesUser.map((x) => x.i18nCode),
                    },
                    status: "En attente",
                  },
                  sort: { updatedAt: -1 },
                }).then((data) => {
                  this._isMounted &&
                    this.setState((pS) => ({
                      languesUser: pS.languesUser.map((x) => ({
                        ...x,
                        nbTrads: (
                          (data.data.data || []).filter(
                            (y) => y.langueCible === x.i18nCode
                          ) || []
                        ).length,
                      })),
                    }));
                });
            }
            if (languesUser.some((x) => x.langueBackupId)) {
              this._isMounted &&
                API.get_langues({
                  _id: {
                    $in: languesUser
                      .filter((x) => x.langueBackupId)
                      .map((x) => x.langueBackupId),
                  },
                }).then((data) => {
                  const languesToPopulate = data.data.data;
                  this._isMounted &&
                    this.setState((pS) => ({
                      languesUser: pS.languesUser.map((x) =>
                        x.langueBackupId
                          ? {
                              ...x,
                              langueBackupId: languesToPopulate.find(
                                (y) => y._id === x.langueBackupId
                              ),
                            }
                          : x
                      ),
                    }));
                });
            }
          });
      });
      API.get_progression().then((data_progr) => {
        if (data_progr.data.totalIndicator.length > 0)
          this._isMounted &&
            this.setState({ progression: data_progr.data.totalIndicator[0] });
      });
      this._isMounted &&
        API.get_tradForReview({
          query: { _id: { $in: user.traductionsFaites } },
          sort: { updatedAt: -1 },
        }).then((data) => {
          this._isMounted &&
            this.setState({ traductionsFaites: data.data.data });
        });
    } else {
      this.setState({
        isMainLoading: false,
        showModal: { ...this.state.showModal, defineUser: true },
      });
    }
    this.setState({ user });
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  toggleModal = (modal) => {
    this.props.tracking.trackEvent({
      action: "toggleModal",
      label: modal,
      value: !this.state.showModal[modal],
    });
    if (
      modal === "defineUser" &&
      this.state.showModal.defineUser &&
      (!this.state.user.selectedLanguages ||
        this.state.user.selectedLanguages.length === 0)
    ) {
      this.triggerConfirmationRedirect();
    } else {
      this.setState((pS) => ({
        showModal: { ...pS.showModal, [modal]: !pS.showModal[modal] },
      }));
    }
  };

  toggleSection = (section) => {
    this.props.tracking.trackEvent({
      action: "toggleSection",
      label: section,
      value: !this.state.showSections[section],
    });
    this.setState({
      showSections: {
        ...this.state.showSections,
        [section]: !this.state.showSections[section],
      },
    });
  };

  triggerConfirmationRedirect = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text:
        "Sans informations sur vos langues de travail, nous allons vous rediriger vers la page d'accueil",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Aller à l'accueil",
      confirmButtonText: "Je veux continuer",
    }).then((result) => {
      if (!result.value) {
        this.props.history.push("/");
      }
    });
  };

  openThemes = (langue) => {
    this.props.tracking.trackEvent({
      action: "click",
      label: "openThemes",
      value: langue._id,
    });
    // Do not pass to big arguments in state otherwise it generates an error on firefox
    // only pass in state what is needed
    this.props.history.push({
      pathname: "/avancement/langue/" + langue._id,
      state: {
        langue: {
          _id: langue._id,
          i18nCode: langue.i18nCode,
          langueFr: langue.langueFr,
        },
      },
    });
  };

  openTraductions = (langue) => {
    this.props.tracking.trackEvent({
      action: "click",
      label: "openTraductions",
      value: langue._id,
    });

    // Do not pass to big arguments in state otherwise it generates an error on firefox
    // only pass in state what is needed
    this.props.history.push({
      pathname: "/avancement/traductions/" + langue._id,
      state: {
        langue: {
          _id: langue._id,
          i18nCode: langue.i18nCode,
          langueFr: langue.langueFr,
        },
      },
    });
  };

  editProfile = () => {
    this.props.tracking.trackEvent({ action: "click", label: "editProfile" });
    this.props.history.push("/backend/user-form");
  };

  setUser = (user) => {
    API.get_langues(
      { _id: { $in: user.selectedLanguages } },
      {},
      "participants"
    ).then((data_langues) => {
      this._isMounted &&
        this.setState({ user, languesUser: data_langues.data.data });
      this.toggleModal("defineUser");
    });
  };

  validateObjectifs = (newUser) => {
    newUser = { _id: this.state.user._id, ...newUser };
    API.set_user_info(newUser).then((data) => {
      Swal.fire({
        title: "Yay...",
        text: "Vos objectifs ont bien été enregistrés",
        type: "success",
        timer: 1500,
      });
      this._isMounted && this.setState({ user: data.data.data });
      this.toggleModal("objectifs");
    });
  };

  upcoming = () =>
    Swal.fire({
      title: "Oh non!",
      text: "Cette fonctionnalité n'est pas encore activée",
      type: "error",
      timer: 1500,
    });

  render() {
    let {
      languesUser,
      traductionsFaites,
      isMainLoading,
      showSections,
    } = this.state;
    return (
      <div className="animated fadeIn user-dash">
        <ReactJoyride
          continuous
          steps={steps}
          run={this.state.runJoyRide}
          scrollToFirstStep
          showProgress
          showSkipButton
        />

        <DashHeader
          traducteur
          title="Mes traductions"
          ctaText="Mes objectifs"
          motsRediges={this.state.progression.wordsCount}
          minutesPassees={Math.floor(
            this.state.progression.timeSpent / 1000 / 60
          )}
          toggle={this.toggleModal}
          upcoming={this.upcoming}
          objectifMots={this.state.user.objectifMots}
          objectifTemps={this.state.user.objectifTemps}
          motsRestants={Math.max(
            0,
            this.state.user.objectifMots - this.state.progression.wordsCount
          )} //inutilisé pour l'instant mais je sans que Hugo va le rajouter bientôt
          minutesRestantes={Math.max(
            0,
            this.state.user.objectifTemps -
              Math.floor(this.state.progression.timeSpent / 1000 / 60)
          )} //idem
        />

        <Row>
          <ProgressionTraduction
            dataArray={languesUser}
            isExpert={this.props.expertTrad}
            user={this.state.user}
            openThemes={this.openThemes}
            openTraductions={this.openTraductions}
            limit={5}
            {...avancement_data}
          />
        </Row>

        <Row className="recent-row">
          <TradTable
            inUserDash
            dataArray={traductionsFaites}
            user={this.state.user}
            langues={languesUser}
            toggleModal={this.toggleModal}
            toggleSection={this.toggleSection}
            hide={!showSections.traductions}
            overlayTitle="Aidez à traduire les contenus"
            overlaySpan="Bilingue ? Polyglotte ? Participez à l’effort de traduction à votre rythme :"
            overlayBtn="Démarrer une session"
            overlayRedirect={false}
            history={this.props.history}
            windowWidth={this.props.windowWidth}
            motsRediges={this.state.progression.wordsCount}
            minutesPassees={Math.floor(
              this.state.progression.timeSpent / 1000 / 60
            )}
            limit={5}
            {...avancement_langue}
          />
        </Row>

        <Modal
          isOpen={this.state.showModal.traducteur}
          toggle={() => this.toggleModal("traducteur")}
          className="modal-plus"
        >
          <TradTable
            dataArray={traductionsFaites}
            user={this.state.user}
            langues={languesUser}
            toggleModal={this.toggleModal}
            windowWidth={this.props.windowWidth}
            history={this.props.history}
            {...avancement_langue}
          />
        </Modal>
        <Modal
          isOpen={this.state.showModal.progression}
          toggle={() => this.toggleModal("progression")}
          className="modal-plus"
        >
          <ProgressionTraduction
            dataArray={this.props.langues}
            isExpert={this.props.expertTrad}
            user={this.state.user}
            openThemes={this.openThemes}
            openTraductions={this.openTraductions}
            {...avancement_data}
          />
        </Modal>

        <ObjectifsModal
          traducteur
          show={this.state.showModal.objectifs}
          toggle={() => this.toggleModal("objectifs")}
          validateObjectifs={this.validateObjectifs}
        />

        <TraducteurModal
          user={this.state.user}
          show={this.state.showModal.defineUser}
          setUser={this.setUser}
          toggle={() => this.toggleModal("defineUser")}
        />

        {isMainLoading && (
          <div className="ecran-protection no-main">
            <div className="content-wrapper">
              <h1 className="mb-3">Chargement...</h1>
              <Spinner color="success" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const buttonTraductions = (element, user, openThemes, openTraductions) =>
  (user.roles || []).find((x) => x && x.nom === "ExpertTrad") ? (
    element.nbTrads > 0 ? (
      <FButton
        type="dark"
        name="done-all-outline"
        fill={variables.noir}
        onClick={() => openTraductions(element)}
      >
        Valider les traductions
      </FButton>
    ) : (
      <b className="meme-ligne">Rien à valider !</b>
    )
  ) : (
    <FButton
      type="dark"
      name="play-circle"
      fill={variables.noir}
      onClick={() => openThemes(element)}
    >
      Démarrer une session
    </FButton>
  );

const ProgressionTraduction = (props) => {
  const hasLangues = (props.dataArray || []).length > 0;
  const dataArray = hasLangues
    ? props.dataArray
    : new Array(5).fill({
        langueFr: "Français",
        langueCode: "fr",
        avancement: 1,
      });
  let data = props.limit ? dataArray.slice(0, props.limit) : dataArray;
  let hideOnPhone = props.hideOnPhone || new Array(props.headers).fill(false);

  return (
    <div className="tableau-wrapper" id="progression-traduction">
      <Row>
        <Col>
          <h1>{props.title}</h1>
        </Col>
      </Row>
      <div className="tableau">
        <Table responsive className="avancement-user-table">
          <thead>
            <tr>
              {props.headers.map((element, key) => (
                <th key={key} className={hideOnPhone[key] ? "hideOnPhone" : ""}>
                  {element}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((element, key) => {
              return (
                <tr
                  key={element._id || key}
                  onClick={() =>
                    element.avancementTrad !== 1 &&
                    (props.isExpert
                      ? props.openTraductions(element)
                      : props.openThemes(element))
                  }
                  className={element.avancementTrad === 1 ? "terminee" : ""}
                >
                  <td className="align-middle">
                    <i
                      className={
                        "flag-icon flag-icon-" + element.langueCode + " h1"
                      }
                      title={element.code}
                      id={element.code}
                    ></i>
                    {element.langueFr}
                  </td>
                  <td className="align-middle hideOnPhone">
                    <Row>
                      <Col>
                        <Progress
                          color={colorAvancement(element.avancementTrad)}
                          value={element.avancementTrad * 100}
                        />
                      </Col>
                      <Col
                        className={
                          "text-" + colorAvancement(element.avancementTrad)
                        }
                      >
                        {element.avancementTrad === 1 ? (
                          <EVAIcon
                            name="checkmark-circle-2"
                            fill={variables.vert}
                          />
                        ) : (
                          <span>
                            {Math.round((element.avancementTrad || 0) * 100)} %
                          </span>
                        )}
                      </Col>
                    </Row>
                  </td>
                  <td className="align-middle hideOnPhone">
                    <b className="mr-10">
                      {(element.participants || []).length}
                    </b>
                    {(element.participants || [])
                      .slice(0, 5)
                      .map((participant) => {
                        return (
                          <img
                            key={participant._id}
                            src={
                              participant.picture
                                ? participant.picture.secure_url
                                : marioProfile
                            }
                            className="profile-img-pin img-circle"
                            alt="random profiles"
                          />
                        );
                      })}
                    {(element.participants || []).length > 5 && " ..."}
                  </td>
                  <td className="align-middle fit-content">
                    {element.avancementTrad !== 1 &&
                      buttonTraductions(
                        element,
                        props.user,
                        props.openThemes,
                        props.openTraductions
                      )}
                  </td>
                </tr>
              );
            })}
            {props.limit && dataArray.length > 5 && (
              <tr>
                <td
                  colSpan="6"
                  className="align-middle voir-plus"
                  onClick={() => props.toggleModal("progression")}
                >
                  <Icon
                    name="expand-outline"
                    fill={variables.noir}
                    size="large"
                  />
                  &nbsp; Voir plus
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    langues: state.langue.langues,
    user: state.user.user,
    expertTrad: state.user.expertTrad,
  };
};

export default track({
  page: "UserDash",
})(connect(mapStateToProps)(UserDash));
