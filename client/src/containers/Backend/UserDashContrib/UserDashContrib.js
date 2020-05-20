import React, { Component } from "react";
import track from "react-tracking";
import { Row, Modal, Spinner } from "reactstrap";
import moment from "moment/min/moment-with-locales";
import Swal from "sweetalert2";
import { connect } from "react-redux";

import API from "../../../utils/API";
import DashHeader from "../../../components/Backend/UserDash/DashHeader/DashHeader";
import { ObjectifsModal, ContributeurModal } from "../../../components/Modals";
import { ContribTable } from "../../../components/Backend/UserProfile";
import { avancement_contrib } from "../UserProfile/data";
import { deleteContrib } from "../UserProfile/functions";
import { fetch_dispositifs } from "../../../Store/actions";

import "./UserDashContrib.scss";

moment.locale("fr");

export class UserDashContrib extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.deleteContrib = deleteContrib.bind(this);
  }

  state = {
    showModal: {
      objectifs: false,
      contributions: false,
      progression: false,
      defineUser: false,
    },
    user: {},
    langues: [],
    allLangues: [],
    contributions: [],
    progression: {
      timeSpent: 0,
      nbMots: 0,
    },
    isMainLoading: true,
  };

  componentDidMount() {
    this._isMounted = true;
    API.get_user_info().then((data_res) => {
      let user = data_res.data.data;
      this._isMounted &&
        API.get_dispositif({
          query: {
            creatorId: user._id,
            status: { $ne: "Supprimé" },
            demarcheId: { $exists: false },
          },
          sort: { updatedAt: -1 },
          populate: "participants",
        }).then((data) => {
          this._isMounted &&
            this.setState({
              contributions: data.data.data,
              isMainLoading: false,
            });
        });
      this._isMounted &&
        API.get_progression().then((data_progr) => {
          if (data_progr.data.data && data_progr.data.data.length > 0)
            this._isMounted &&
              this.setState({ progression: data_progr.data.data[0] });
        });
      this._isMounted &&
        this.setState({
          user: user,
          contributeur: user.roles.some((x) => x.nom === "Contrib"),
        });
    });
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
    this.setState(
      {
        showModal: {
          ...this.state.showModal,
          [modal]: !this.state.showModal[modal],
        },
      },
      () => console.log(this.state)
    );
  };

  setUser = (user) => {
    // API.get_langues({'_id': { $in: user.selectedLanguages}},{},'participants').then(data_langues => {
    //   this.setState({user, langues: data_langues.data.data});
    this.toggleModal("defineUser");
    // })
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
      this.setState({ user: data.data.data });
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
    let { contributions, contributeur, user, isMainLoading } = this.state;
    return (
      <div className="animated fadeIn user-dash-contrib">
        <DashHeader
          contributeur
          title="Espace rédaction"
          ctaText="Mes objectifs"
          motsRediges={this.state.progression.nbMots}
          minutesPassees={Math.floor(
            this.state.progression.timeSpent / 1000 / 60
          )}
          toggle={this.toggleModal}
          upcoming={this.upcoming}
          objectifMots={this.state.user.objectifMotsContrib}
          objectifTemps={this.state.user.objectifTempsContrib}
          motsRestants={Math.max(
            0,
            this.state.user.objectifMots - this.state.progression.nbMots
          )} //inutilisé pour l'instant mais je sans que Hugo va le rajouter bientôt -- je me suis pas trompé !
          minutesRestantes={Math.max(
            0,
            this.state.user.objectifTemps -
              Math.floor(this.state.progression.timeSpent / 1000 / 60)
          )} //idem
        />

        <Row className="recent-row">
          <ContribTable
            type="user"
            dataArray={contributions}
            user={user}
            contributeur={contributeur}
            toggleModal={this.toggleModal}
            limit={5}
            overlayTitle="Ici, vous pourrez accéder à vos contributions"
            overlaySpan="Proposez de nouveaux contenus pour enrichir la plateforme, ou aider à corriger et à tenir à jour les contenus existants"
            overlayBtn="Commencer à rédiger"
            overlayRedirect={true}
            history={this.props.history}
            displayIndicators={false}
            deleteContrib={this.deleteContrib}
            {...avancement_contrib}
          />
        </Row>

        <Modal
          isOpen={this.state.showModal.contributions}
          toggle={() => this.toggleModal("contributions")}
          className="modal-plus"
        >
          <ContribTable
            type="user"
            dataArray={contributions}
            user={user}
            contributeur={contributeur}
            toggleModal={this.toggleModal}
            history={this.props.history}
            deleteContrib={this.deleteContrib}
            {...avancement_contrib}
          />
        </Modal>

        <ObjectifsModal
          contributeur
          show={this.state.showModal.objectifs}
          toggle={() => this.toggleModal("objectifs")}
          validateObjectifs={this.validateObjectifs}
        />

        <ContributeurModal
          show={this.state.showModal.defineUser}
          toggle={() => this.toggleModal("defineUser")}
          setUser={this.setUser}
          redirect={false}
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

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    userId: state.user.userId,
  };
};

const mapDispatchToProps = { fetch_dispositifs };

export default track({
  page: "UserDashContrib",
})(connect(mapStateToProps, mapDispatchToProps)(UserDashContrib));
