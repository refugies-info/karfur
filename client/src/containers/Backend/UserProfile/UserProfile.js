import React, { Component } from 'react';
import track from 'react-tracking';
import { Col, Row, Card, CardBody, CardHeader, CardFooter, Modal, Spinner, Input, Button } from 'reactstrap';
import Swal from 'sweetalert2';
import Icon from 'react-eva-icons';
import h2p from 'html2plaintext';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import windowSize from 'react-window-size';

import marioProfile from '../../../assets/mario-profile.jpg';
import API from '../../../utils/API';
import {ActionTable, TradTable, ContribTable, FavoriTable} from '../../../components/Backend/UserProfile';
import {ThanksModal, SuggestionModal, ObjectifsModal, ContributeurModal, TraducteurModal} from '../../../components/Modals';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';
import ModifyProfile from '../../../components/Backend/UserProfile/ModifyProfile/ModifyProfile';

import {fakeTraduction, fakeContribution, fakeFavori, avancement_langue,  avancement_contrib, avancement_actions, avancement_favoris} from './data'

import './UserProfile.scss';
import SVGIcon from '../../../components/UI/SVGIcon/SVGIcon';

class UserProfile extends Component {
  state={
    showModal:{action:false, traducteur: false, contributeur: false, thanks:false, favori:false, suggestion: false, objectifs:false, devenirContributeur: false, devenirTraducteur: false}, 
    showSections:{traductions: true, contributions: true},
    user: {},
    traductions:[],
    contributions:[],
    actions:[],
    favoris:[],
    langues:[],
    traducteur:false,
    contributeur:false,
    editing: false,
    isDropdownOpen:[],
    uploading: false,
    suggestion:{},
    progression:{
      timeSpent:0,
      nbMots:0
    },
    tempImg: null
  }

  componentDidMount() {
    API.get_user_info().then(data_res => {
      let user=data_res.data.data;
      API.get_tradForReview({'userId': user._id}).then(data => {
        console.log(data.data.data)
        this.setState({traductions: data.data.data})
      })
      API.get_dispositif({'creatorId': user._id}).then(data => {
        console.log(data.data.data)
        this.setState({contributions: data.data.data, actions: this.parseActions(data.data.data)})
      })
      console.log(user)
      this.setState({user:user, traducteur:user.roles.some(x=>x.nom==="Trad"), contributeur:user.roles.some(x=>x.nom==="Contrib"), isDropdownOpen: new Array((user.selectedLanguages || []).length).fill(false)})
    })
    API.get_langues({}).then(data => this.setState({ langues: data.data.data }))
    API.get_progression().then(data_progr => {
      if(data_progr.data.data && data_progr.data.data.length>0)
        this.setState({progression: data_progr.data.data[0]})
    })
  }

  parseActions = dispositifs => {
    let actions = [];
    dispositifs.forEach(dispo => {
      ['suggestions', 'questions', 'signalements'].map(item => {
        if(dispo[item] && dispo[item].length > 0){
          actions= [...actions, ...dispo[item].map(x => ({
            action : item,
            titre: dispo.titreInformatif,
            owner: true,
            depuis : x.createdAt,
            texte : x.suggestion,
            read : x.read,
            username : x.username,
            picture : x.picture,
            dispositifId:dispo._id,
            suggestionId:x.suggestionId
          }))];
        }
      })
    });
    return actions
  }

  toggleModal = (modal) => {
    this.props.tracking.trackEvent({ action: 'toggleModal', label: modal, value : !this.state.showModal[modal] });
    this.setState({showModal : {...this.state.showModal, [modal]: !this.state.showModal[modal]}})
  }

  toggleSection = (section) => {
    this.props.tracking.trackEvent({ action: 'toggleSection', label: section, value : !this.state.showSections[section] });
    this.setState({showSections : {...this.state.showSections, [section]: !this.state.showSections[section]}})
  }

  toggleEditing = () => this.setState({editing : !this.state.editing})
  
  toggleDropdown = (e, key) => {
    if(this.state.isDropdownOpen[key] && e.currentTarget.id){
      this.setState({
        user : {...this.state.user, selectedLanguages:[...this.state.user.selectedLanguages].map((x,i)=> i==key ? this.state.langues[e.currentTarget.id] : x)},
      })
    }
    this.setState({ isDropdownOpen: this.state.isDropdownOpen.map((x,i)=> i===key ? !x : false)})
  };

  showSuggestion = (suggestion) => {
    this.setState({suggestion});
    this.toggleModal('suggestion');
  }

  archiveSuggestion = (suggestion) => {
    let dispositif = {
      dispositifId: suggestion.dispositifId,
      suggestionId: suggestion.suggestionId,
      fieldName: suggestion.action,
      type: 'pull'
    }
    console.log(dispositif)
    API.update_dispositif(dispositif).then(data => {
      console.log(data.data.data)
      this.setState({actions: this.state.actions.filter(x=> x.suggestionId !== suggestion.suggestionId)})
    })
  }

  addLangue = () => {
    this.setState({
      user : {...this.state.user, selectedLanguages:[...(this.state.user.selectedLanguages || []), (this.state.langues.length > 0 ? this.state.langues[0] : {})]},
      isDropdownOpen: new Array(this.state.isDropdownOpen.length + 1).fill(false)
    })
  }

  removeLang = (e,idx) => {
    e.stopPropagation();
    this.setState({
      user : {...this.state.user, selectedLanguages:[...this.state.user.selectedLanguages || []].filter((_,i) => i!==idx)},
      isDropdownOpen: new Array(this.state.isDropdownOpen.length - 1).fill(false)
    })
  }

  handleChange = (ev) => this.setState({ user: { ...this.state.user, [ev.currentTarget.id]:ev.target.value } });

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
      Swal.fire( 'Yay...', 'Vos objectifs ont bien été enregistrés', 'success')
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
      Swal.fire( 'Yay...', 'Votre profil a bien été enregistré', 'success')
      this.setState({ editing:false, user: data.data.data })
    })
  }

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')

  render() {
    let {traducteur, contributeur, traductions, contributions, actions, langues, user, showSections}=this.state;
    if(!traducteur){traductions= new Array(5).fill(fakeTraduction)}
    if(!contributeur){contributions= new Array(5).fill(fakeContribution)}

    let favoris = ((user.cookies || {}).dispositifsPinned || []),hasFavori=true;
    if(favoris.length === 0){favoris= new Array(5).fill(fakeFavori); hasFavori=false;}

    let imgSrc = this.state.tempImg || (this.state.user.picture || []).secure_url || marioProfile

    const ProfilePic = () => {
      if(this.state.uploading){
        return <Spinner color="dark" className="fadeIn fadeOut" />
      }else{
        return <img className="img-circle user-picture" src={imgSrc} alt="profile"/>
      }
    }

    let nbReactions = contributions.map(dispo => ((dispo.merci || []).length + (dispo.bravo || []).length)).reduce((a,b) => a + b, 0);

    let anchorOffset = '120';
    return (
      <div className="animated fadeIn user-profile">
        <div className="profile-header">
          <AnchorLink href="#mon-profil" offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
            <EVAIcon name="settings-2-outline" fill="#3D3D3D" className="header-icon" /> {' '}
            <span className="hideOnPhone">Mon profil</span>
          </AnchorLink>
          <AnchorLink href={(contributeur || traducteur) ? "#actions-requises" : "#mes-favoris"} offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
            <EVAIcon name={((contributeur || traducteur) ? "bell-" : "bookmark-" ) + "outline"} fill="#3D3D3D" className="header-icon" /> {' '}
            <span className="hideOnPhone">{(contributeur || traducteur) ? "Actions requises" : "Mes favoris"}</span>
          </AnchorLink>
          {showSections.contributions && <AnchorLink href="#mes-contributions" offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
            <EVAIcon name="file-add-outline" fill="#3D3D3D" className="header-icon" /> {' '}
            <span className="hideOnPhone">Mes articles</span>
          </AnchorLink>}
          {showSections.traductions && <AnchorLink href="#mes-traductions" offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
            <SVGIcon name="bubbleTranslate" fill="#3D3D3D" className="header-icon" /> {' '}
            <span className="hideOnPhone">Mes traductions</span>
          </AnchorLink>}
          {(contributeur || traducteur) &&
            <AnchorLink href="#mes-favoris" offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
              <EVAIcon name="bookmark-outline" fill="#3D3D3D" className="header-icon" /> {' '}
              <span className="hideOnPhone">Mes favoris</span>
            </AnchorLink>}
          {false && 
            <AnchorLink href="#mes-contributions" offset={anchorOffset} className="header-anchor d-inline-flex justify-content-center align-items-center">
              <EVAIcon name="message-circle-outline" fill="#3D3D3D" className="header-icon" /> {' '}
              <span className="hideOnPhone">Messages</span>
            </AnchorLink>}
        </div>
        <div className="profile-content" id="mon-profil">
          <Row className="profile-info">
            <Col xl="2" lg="4" md="12" sm="12" xs="12"  className="profile-left">
              <CardBody>
                <div className="profile-header-container">   
                  <div className="rank-label-container">
                    {this.state.uploading && <Spinner color="dark" className="fadeIn fadeOut" />}
                    <img className="img-circle user-picture" src={imgSrc} alt="profile"/>
                    {this.state.editing && <>
                      <Input 
                        className="file-input"
                        type="file"
                        id="picture" 
                        name="user" 
                        accept="image/*"
                        onChange = {this.handleFileInputChange} />
                      <span className="label label-default rank-label">Changer</span> </>}
                  </div>
                </div> 
              </CardBody>
              <CardFooter>
                {!this.state.editing && <h2 className="name">{user.username}</h2>}
                <span className="status">{traducteur ? "Traducteur" : (contributeur ? "Contributeur" : "Utilisateur")}</span>
              </CardFooter>
            </Col>
            <Col xl="4" lg="8" md="12" sm="12" xs="12" className="modify-col">
              <ModifyProfile
                handleChange={this.handleChange}
                toggleDropdown={this.toggleDropdown}
                addLangue={this.addLangue}
                removeLang={this.removeLang}
                toggleEditing={this.toggleEditing}
                validateProfile = {this.validateProfile}
                {...this.state} />
            </Col>

            <Col xl="6" lg="12" md="12" sm="12" xs="12" className="user-col">
              <Card className="profile-right">
                <CardHeader>
                  Vos objectifs de contribution hebdomadaires
                  <EVAIcon name="settings-2-outline" className="align-right pointer" onClick={()=>this.toggleModal('objectifs')} />
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col className="obj-first">
                      <h1 className="title">{Math.floor(this.state.progression.timeSpent / 1000 / 60)}/{user.objectifTemps || "60"}</h1>
                      <h6 className="subtitle">minutes contribuées</h6>
                      <span className="content">{Math.floor(this.state.progression.timeSpent / 1000 / 60)} minutes passées à informer les personnes réfugiées. Merci !</span>
                    </Col>
                    <Col className="obj-second">
                      <h1 className="title">234/{user.objectifMotsContrib || "600"}</h1>
                      <h6 className="subtitle">mots écrits</h6>
                      <span className="content">pour les personnes réfugiées. Merci !</span>
                    </Col>
                    <Col className="obj-third">
                      <h1 className="title">{this.state.progression.nbMots}/{user.objectifMots || "60"}</h1>
                      <h6 className="subtitle">mots traduits</h6>
                      <span className="content">pour les personnes réfugiées. Merci !</span>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <div className="user-feedbacks pointer d-flex align-items-center" onClick={()=>this.toggleModal('thanks')}>
                    <EVAIcon name="heart" fill="#60A3BC" className="margin-right-8 d-inline-flex" />
                    {nbReactions>0 ?
                      <span>Vous avez participé à l’information de <u>{nbReactions} personne{nbReactions > 1 ? "s" : ""}</u>. Merci.</span> :
                      <span>Ici, nous vous dirons combien de personnes vous allez aider."</span>}
                  </div>
                </CardFooter>
                {!(contributeur || traducteur) &&
                  <div className="ecran-protection no-obj">
                    <div className="content-wrapper">
                      <Button color="white" onClick={()=>this.toggleModal('devenirContributeur')}>
                        <Icon name="award-outline" fill="#3D3D3D" /> 
                        Devenir contributeur pour débloquer cette section
                      </Button>
                    </div>
                  </div>}
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
              hasFavori={hasFavori}
              history={this.props.history}
              limit={5}
              {...avancement_favoris} />
          }

          <ContribTable 
            dataArray={contributions}
            user={this.state.user}
            contributeur={contributeur}
            toggleModal={this.toggleModal}
            toggleSection={this.toggleSection}
            windowWidth={this.props.windowWidth}
            limit={5}
            hide={!showSections.contributions}
            overlayTitle="On a besoin de vous !"
            overlaySpan="Proposez de nouveaux contenus pour enrichir la plateforme, ou aider à corriger et à tenir à jour les contenus existants"
            overlayBtn="Devenir contributeur"
            overlayRedirect={false}
            {...avancement_contrib} />

          <TradTable 
            dataArray={traductions}
            traducteur={traducteur}
            user={this.state.user}
            langues={langues}
            toggleModal={this.toggleModal}
            toggleSection={this.toggleSection}
            hide={!showSections.traductions}
            overlayTitle="Par ici aussi !"
            overlaySpan="Participez à la traduction de la plateforme à votre rythme et sans pression. Rejoignez un groupe de traducteurs bénévoles et de linguistes professionnels mobilisés pour les réfugiés."
            overlayBtn="Devenir traducteur"
            overlayRedirect={false}
            history={this.props.history}
            windowWidth={this.props.windowWidth}
            motsRediges={this.state.progression.nbMots}
            minutesPassees={Math.floor(this.state.progression.timeSpent / 1000 / 60)}
            limit={5}
            {...avancement_langue} />

            {(contributeur || traducteur) &&
              <FavoriTable 
                dataArray={favoris}
                toggleModal={this.toggleModal}
                removeBookmark={this.removeBookmark}
                upcoming={this.upcoming}
                hasFavori={hasFavori}
                history={this.props.history}
                limit={5}
                {...avancement_favoris} />
              }
        </div>

        <Modal isOpen={this.state.showModal.action} toggle={()=>this.toggleModal('action')} className='modal-plus'>
          <ActionTable 
            dataArray={actions}
            toggleModal={this.toggleModal}
            showSuggestion={this.showSuggestion}
            archive={this.archiveSuggestion}
            {...avancement_actions} />
        </Modal>
        
        <Modal isOpen={this.state.showModal.contributeur} toggle={()=>this.toggleModal('contributeur')} className='modal-plus'>
          <ContribTable 
            dataArray={contributions}
            user={user}
            toggleModal={this.toggleModal}
            windowWidth={this.props.windowWidth}
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
            hasFavori={hasFavori}
            history={this.props.history}
            {...avancement_favoris} />
        </Modal>

        <ThanksModal show={this.state.showModal.thanks} toggle={()=>this.toggleModal('thanks')} />
        <SuggestionModal suggestion={this.state.suggestion} show={this.state.showModal.suggestion} toggle={()=>this.toggleModal('suggestion')} />
        <ContributeurModal 
          redirect={true}
          history={this.props.history}
          show={this.state.showModal.devenirContributeur} 
          toggle={()=>this.toggleModal('devenirContributeur')} />
        
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
      </div>
    );
  }
}

export default track({
  page: 'UserProfile',
})(windowSize(UserProfile));
