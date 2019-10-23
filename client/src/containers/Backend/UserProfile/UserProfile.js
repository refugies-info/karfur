import React, { Component } from 'react';
import track from 'react-tracking';
import { Col, Row, Card, CardBody, CardFooter, Modal, Spinner, Input } from 'reactstrap';
import Swal from 'sweetalert2';
import h2p from 'html2plaintext';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import windowSize from 'react-window-size';
import { connect } from 'react-redux';
import {NavLink} from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import marioProfile from '../../../assets/mario-profile.jpg';
import API from '../../../utils/API';
import {ActionTable, TradTable, ContribTable, FavoriTable, StructureCard} from '../../../components/Backend/UserProfile';
import {ThanksModal, SuggestionModal, ObjectifsModal, TraducteurModal, AddMemberModal} from '../../../components/Modals';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';
import ModifyProfile from '../../../components/Backend/UserProfile/ModifyProfile/ModifyProfile';
import SVGIcon from '../../../components/UI/SVGIcon/SVGIcon';
import FButton from '../../../components/FigmaUI/FButton/FButton';
import {selectItem, editMember, addMember} from '../UserDashStruct/functions';
import {avancement_langue,  avancement_contrib, avancement_actions, avancement_favoris, data_structure} from './data'
import {showSuggestion, archiveSuggestion, parseActions, deleteContrib, getProgression} from './functions';
import {fetch_user, fetch_dispositifs} from '../../../Store/actions';

import './UserProfile.scss';
import variables from 'scss/colors.scss';

const anchorOffset = '120';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.showSuggestion = showSuggestion.bind(this);
    this.archiveSuggestion = archiveSuggestion.bind(this);
    this.selectItem = selectItem.bind(this);
    this.editMember = editMember.bind(this);
    this.addMember = addMember.bind(this);
    this.deleteContrib = deleteContrib.bind(this);
    this.getProgression = getProgression.bind(this);
  }

  state={
    showModal:{actions:false, traducteur: false, contributions: false, thanks:false, favori:false, suggestion: false, objectifs:false, devenirContributeur: false, devenirTraducteur: false, addMember: false}, 
    showSections:{traductions: true, contributions: true},
    user: {},
    traductions:[],
    contributions:[],
    actions:[],
    favoris:[],
    langues:[],
    structure: {},
    actionsStruct: [],
    traducteur:false,
    contributeur:false,
    editing: false,
    isDropdownOpen:[],
    uploading: false,
    suggestion:{},
    progression:{
      timeSpent:0,
      nbMots:0,
      nbMotsContrib: 0,
    },
    tempImg: null,
    isMainLoading:true,
    users:[],
    selected:{},
  }

  componentDidMount() {
    const user=this.props.user, userId = this.props.user;
    API.get_tradForReview({'userId': userId}).then(data => { console.log(data.data.data);
      this.setState({traductions: data.data.data})
    })
    API.get_dispositif({query: {'creatorId': userId, status: {$ne: "Supprimé"}, demarcheId: { $exists: false }}}).then(data => { console.log(data.data.data);
      this.setState({contributions: data.data.data, actions: parseActions(data.data.data)})
    })
    if(user.structures && user.structures.length > 0){
      this.initializeStructure();
      API.get_dispositif({query: {'mainSponsor': user.structures[0]}}).then(data => {
        this.setState({actionsStruct: parseActions(data.data.data)})
      })
    }
    console.log(user)
    this.setState({user:user, isMainLoading:false, traducteur:user.roles.some(x=>x.nom==="Trad"), contributeur:user.roles.some(x=>x.nom==="Contrib"), isDropdownOpen: new Array((user.selectedLanguages || []).length).fill(false)})
    
    API.get_users().then(data => this.setState({users: data.data.data}) );
    API.get_langues({}).then(data => this.setState({ langues: data.data.data }))
    this.getProgression();
    window.scrollTo(0, 0);
  }

  initializeStructure = () => {
    const user=this.props.user;
    API.get_structure({_id: user.structures[0] }).then(data => { console.log(data.data.data);
      this.setState({structure:data.data.data[0]})
    })
  }

  toggleModal = (modal) => {
    this.props.tracking.trackEvent({ action: 'toggleModal', label: modal, value : !this.state.showModal[modal] });
    this.setState({showModal : {...this.state.showModal, [modal]: !this.state.showModal[modal]}}, () => console.log(this.state))
  }

  toggleSection = (section) => {
    this.props.tracking.trackEvent({ action: 'toggleSection', label: section, value : !this.state.showSections[section] });
    this.setState({showSections : {...this.state.showSections, [section]: !this.state.showSections[section]}})
  }

  toggleEditing = () => this.setState({editing : !this.state.editing})

  handleChange = (ev) => this.setState({ user: { ...this.state.user, [ev.currentTarget.id]: ev.currentTarget.id === "description" ? ev.target.value.slice(0,120) : ev.target.value } });

  handleFileInputChange = event => {
    this.setState({uploading:true})
    let file=event.target.files[0]

    //On l'affiche déjà directement pour l'utilisateur
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.addEventListener("load", () => this.setState({ tempImg : reader.result} ) , false);

    //On l'envoie ensuite au serveur
    const formData = new FormData()
    formData.append(0, file)
    API.set_image(formData).then(data_res => {
      this.setState({
        user:{
          ...this.state.user,
          picture: data_res.data.data
        },
        uploading:false,
        tempImg: null
      });
    })
  }

  removeBookmark = (key) => {
    let user={...this.state.user};
    user.cookies.dispositifsPinned = key==='all' ? [] : user.cookies.dispositifsPinned.filter(x => x._id !== key);
    API.set_user_info(user).then((data) => {
      this.setState({ user: data.data.data })
    })
  }

  validateObjectifs = (newUser) => {
    newUser={ _id: this.state.user._id, ...newUser }
    API.set_user_info(newUser).then((data) => {
      Swal.fire( {title: 'Yay...', text: 'Vos objectifs ont bien été enregistrés', type: 'success', timer: 1500})
      this.setState({user:data.data.data})
      this.toggleModal('objectifs')
    })
  }

  validateProfile = () => {
    let user = {...this.state.user};
    let newUser={
      _id:user._id,
      username:h2p(user.username),
      selectedLanguages: [...new Set(user.selectedLanguages)],
      email:h2p(user.email),
      description:h2p(user.description),
      picture: user.picture
    }
    API.set_user_info(newUser).then((data) => {
      this.props.fetch_user();
      Swal.fire( {title: 'Yay...', text: 'Votre profil a bien été enregistré', type: 'success', timer: 1500})
      this.setState({ editing:false, user: data.data.data })
    })
  }

  upcoming = () => Swal.fire( {title: 'Oh non!', text: 'Cette fonctionnalité n\'est pas encore activée', type: 'error', timer: 1500 })

  render() {
    const {traducteur, contributeur, traductions, contributions, actions, langues, structure, user, showSections, isMainLoading, actionsStruct}=this.state;
    const {t}= this.props;
    const favoris = ((user.cookies || {}).dispositifsPinned || []);
    
    const imgSrc = this.state.tempImg || (this.state.user.picture || []).secure_url || marioProfile

    // let nbReactions = contributions.map(dispo => ((dispo.merci || []).length + (dispo.bravo || []).length)).reduce((a,b) => a + b, 0);
    return (
      <div className="animated fadeIn user-profile">
        <div className="profile-header">
          <AnchorLink href="#mon-profil" offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
            <EVAIcon name="settings-2-outline" fill={variables.noir} className="header-icon" /> {' '}
            <span className="hideOnPhone">{t("Tables.Mon profil", "Mon profil")}</span>
          </AnchorLink>
          <AnchorLink href={(contributeur || traducteur) ? "#actions-requises" : "#mes-favoris"} offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
            <EVAIcon name={((contributeur || traducteur) ? "bell-" : "bookmark-" ) + "outline"} fill={variables.noir} className="header-icon" /> {' '}
            <span className="hideOnPhone">{(contributeur || traducteur) ? t("Tables.Notifications", "Notifications") : t("Tables.Favoris", "Favoris")}</span>
          </AnchorLink>
          {showSections.contributions && <AnchorLink href="#mes-contributions" offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
            <EVAIcon name="file-add-outline" fill={variables.noir} className="header-icon" /> {' '}
            <span className="hideOnPhone">{t("Tables.Rédactions", "Rédactions")}</span>
          </AnchorLink>}
          {showSections.traductions && <AnchorLink href="#mes-traductions" offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
            <SVGIcon name="translate" fill={variables.noir} className="header-icon svgico" /> {' '}
            <span className="hideOnPhone">{t("Tables.Traductions", "Traductions")}</span>
          </AnchorLink>}
          {(contributeur || traducteur) &&
            <AnchorLink href="#mes-favoris" offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
              <EVAIcon name="bookmark-outline" fill={variables.noir} className="header-icon" /> {' '}
              <span className="hideOnPhone">{t("Tables.Favoris", "Favoris")}</span>
            </AnchorLink>}
          {structure && structure._id &&
            <AnchorLink href="#structure" offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
              <EVAIcon name="briefcase-outline" fill={variables.noir} className="header-icon" /> {' '}
              <span className="hideOnPhone">{t("Tables.Ma structure", "Ma structure")}</span>
            </AnchorLink>}
          {false && 
            <AnchorLink href="#mes-contributions" offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
              <EVAIcon name="message-circle-outline" fill={variables.noir} className="header-icon" /> {' '}
              <span className="hideOnPhone">{t("Tables.Messages", "Messages")}</span>
            </AnchorLink>}
        </div>
        <div className="profile-content" id="mon-profil">
          <Row className="profile-info">
            <div className="profile-left">
              <div className={"shadow-wrapper" + (this.state.editing ? " active" : "")}>
                <CardBody>
                  <div className="profile-header-container">   
                    <div className="rank-label-container">
                      {this.state.uploading && <Spinner color="success" className="fadeIn fadeOut position-absolute" />}
                      <img className="img-circle user-picture" src={imgSrc} alt="profile"/>
                      {this.state.editing && <>
                        <Input 
                          className="file-input"
                          type="file"
                          id="picture" 
                          name="user" 
                          accept="image/*"
                          onChange = {this.handleFileInputChange} />
                        <span className="label label-default rank-label">{t("Changer", "Changer")}</span> </>}
                    </div>
                  </div> 
                </CardBody>
                <CardFooter>
                  {!this.state.editing && <h2 className="name">{user.username}</h2>}
                  <span className="status">{traducteur ? t("UserProfile.Traducteur", "Traducteur") : (contributeur ? t("UserProfile.Contributeur", "Contributeur") : t("UserProfile.Utilisateur", "Utilisateur"))}</span>
                </CardFooter>
              </div>
            </div>
            <Col className="modify-col">
              <ModifyProfile
                handleChange={this.handleChange}
                toggleEditing={this.toggleEditing}
                validateProfile = {this.validateProfile}
                {...this.state} />
            </Col>

            <Col xl="auto" lg="auto" md="12" sm="12" xs="12" className="user-col">
              <Card className="profile-right">
                <CardBody>
                  <Row>
                    <Col className={"obj-first" + (this.state.progression.timeSpent > 0 ? " active" : "")}>
                      <NavLink to="/dispositif">
                        <h1 className="title text-big">{Math.round(this.state.progression.timeSpent / 1000 / 60) || 0}</h1>
                        <h6 className="subtitle">{t("UserProfile.minutes données", "minutes données")}</h6>
                        <span className="content texte-small">{t("UserProfile.commencez à contribuer", "Commencez à contribuer pour démarrer le compteur")}.</span>
                      </NavLink>
                    </Col>
                    <Col className={"obj-second" + (this.state.progression.nbMotsContrib > 0 ? " active" : "")}>
                      <NavLink to="/dispositif">
                        <h1 className="title text-big">{this.state.progression.nbMotsContrib || 0}</h1>
                        <h6 className="subtitle">{t("UserProfile.mots écrits", "mots écrits")}</h6>
                        <span className="content texte-small">{t("UserProfile.commencez à rédiger", "Rédigez votre premier contenu pour démarrer le compteur")}.</span>
                      </NavLink>
                    </Col>
                    <Col className={"obj-third" + (this.state.progression.nbMots > 0 ? " active" : "")}>
                      <NavLink to="/backend/user-dashboard">
                        <h1 className="title text-big">{this.state.progression.nbMots || 0}</h1>
                        <h6 className="subtitle">{t("UserProfile.mots traduits", "mots traduits")}</h6>
                        <span className="content texte-small">{t("UserProfile.commencez à traduire", "Traduisez vos premiers mots pour démarrer le compteur")}.</span>
                      </NavLink>
                    </Col>
                  </Row>
                </CardBody>
                {/* <CardFooter>
                  <div className="user-feedbacks pointer d-flex align-items-center" onClick={()=>this.toggleModal('thanks')}>
                    <EVAIcon name="heart" fill="#60A3BC" className="margin-right-8 d-inline-flex" />
                    {nbReactions>0 ?
                      <span>Vous avez participé à l’information de <u>{nbReactions} personne{nbReactions > 1 ? "s" : ""}</u>. Merci.</span> :
                      <span>Ici, nous vous dirons combien de personnes vous allez aider."</span>}
                  </div>
                </CardFooter> */}
              </Card>
            </Col>
          </Row>
          
          {(contributeur || traducteur) ?
            <ActionTable 
              dataArray={actions}
              toggleModal={this.toggleModal}
              showSuggestion={this.showSuggestion}
              upcoming={this.upcoming}
              archive={this.archiveSuggestion}
              limit={5}
              {...avancement_actions} />:
            <FavoriTable 
              dataArray={favoris}
              toggleModal={this.toggleModal}
              removeBookmark={this.removeBookmark}
              upcoming={this.upcoming}
              history={this.props.history}
              limit={5}
              {...avancement_favoris} />
          }

          <ContribTable 
            type="user"
            displayIndicators
            dataArray={contributions}
            user={this.state.user}
            toggleModal={this.toggleModal}
            toggleSection={this.toggleSection}
            windowWidth={this.props.windowWidth}
            limit={5}
            hide={!showSections.contributions}
            overlayTitle="Rédigez des nouveaux contenus"
            overlaySpan="Réfugiés-info est une plateforme contributive, vous pouvez participer à son enrichissement"
            overlayBtn="Découvrir comment contribuer"
            overlayRedirect={false}
            history={this.props.history}
            deleteContrib = {this.deleteContrib}
            {...avancement_contrib} />

          <TradTable 
            displayIndicators
            dataArray={traductions}
            user={this.state.user}
            langues={langues}
            toggleModal={this.toggleModal}
            toggleSection={this.toggleSection}
            hide={!showSections.traductions}
            overlayTitle="Aidez à traduire les contenus"
            overlayi18n="bilingue"
            overlaySpan="Bilingue ? Polyglotte ? Participez à l’effort de traduction à votre rythme :"
            overlayBtn="Démarrer une session"
            overlayRedirect={false}
            history={this.props.history}
            windowWidth={this.props.windowWidth}
            motsRediges={this.state.progression.nbMots}
            minutesPassees={Math.floor(this.state.progression.timeSpent / 1000 / 60)}
            limit={5}
            {...avancement_langue} />

          {(contributeur || traducteur) ?
            <FavoriTable 
              dataArray={favoris}
              toggleModal={this.toggleModal}
              removeBookmark={this.removeBookmark}
              upcoming={this.upcoming}
              history={this.props.history}
              limit={5}
              {...avancement_favoris} /> :
            <ActionTable 
              dataArray={actions}
              toggleModal={this.toggleModal}
              showSuggestion={this.showSuggestion}
              upcoming={this.upcoming}
              archive={this.archiveSuggestion}
              limit={5}
              {...avancement_actions} />
            }

          {structure && structure._id &&
            <StructureCard
              displayIndicators
              structure={structure}
              actions={actionsStruct}
              user={user}
              toggleModal={this.toggleModal}
              {...data_structure} />}
        </div>

        <Modal isOpen={this.state.showModal.actions} toggle={()=>this.toggleModal('actions')} className='modal-plus'>
          <ActionTable 
            dataArray={actions}
            toggleModal={this.toggleModal}
            showSuggestion={this.showSuggestion}
            archive={this.archiveSuggestion}
            {...avancement_actions} />
        </Modal>
        
        <Modal isOpen={this.state.showModal.contributions} toggle={()=>this.toggleModal('contributions')} className='modal-plus'>
          <ContribTable 
            type="user"
            dataArray={contributions}
            user={user}
            toggleModal={this.toggleModal}
            windowWidth={this.props.windowWidth}
            deleteContrib = {this.deleteContrib}
            {...avancement_contrib} />
        </Modal>

        <Modal isOpen={this.state.showModal.traducteur} toggle={()=>this.toggleModal('traducteur')} className='modal-plus'>
          <TradTable 
            dataArray={traductions}
            user={this.state.user}
            langues={langues}
            toggleModal={this.toggleModal}
            windowWidth={this.props.windowWidth}
            {...avancement_langue} />
        </Modal>

        <Modal isOpen={this.state.showModal.favori} toggle={()=>this.toggleModal('favori')} className='modal-plus'>
          <FavoriTable 
            dataArray={favoris}
            toggleModal={this.toggleModal}
            removeBookmark={this.removeBookmark}
            history={this.props.history}
            {...avancement_favoris} />
        </Modal>

        <ThanksModal show={this.state.showModal.thanks} toggle={()=>this.toggleModal('thanks')} />
        <SuggestionModal suggestion={this.state.suggestion} show={this.state.showModal.suggestion} toggle={()=>this.toggleModal('suggestion')} />
        {/* <ContributeurModal 
          redirect={true}
          history={this.props.history}
          show={this.state.showModal.devenirContributeur} 
          toggle={()=>this.toggleModal('devenirContributeur')} /> */}
        
        <TraducteurModal 
          user={this.state.user} 
          langues={this.state.langues}
          show={this.state.showModal.devenirTraducteur} 
          redirect
          toggle={()=>this.toggleModal('devenirTraducteur')} />

        <ObjectifsModal 
          show={this.state.showModal.objectifs} 
          toggle={()=>this.toggleModal('objectifs')}
          validateObjectifs={this.validateObjectifs} />

        <AddMemberModal 
          show={this.state.showModal.addMember}
          toggle={()=>this.toggleModal("addMember")}
          users={this.state.users}
          selectItem={this.selectItem}
          addMember={this.addMember}
          selected={this.state.selected}
        />

        {isMainLoading &&
          <div className="ecran-protection no-main">
            <div className="content-wrapper">
              <h1 className="mb-3">{t("Chargement", "Chargement")}...</h1>
              <Spinner color="success" />
            </div>
          </div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    userId: state.user.userId,
  }
}

const mapDispatchToProps = {fetch_user, fetch_dispositifs};

export default track({
  page: 'UserProfile',
})(connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(
    windowSize(
      UserProfile)
    )
  )
);
