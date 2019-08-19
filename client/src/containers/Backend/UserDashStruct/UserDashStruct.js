import React, { Components, Component } from 'react';
import track from 'react-tracking';
import { Modal, Spinner } from 'reactstrap';
import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import {NavLink} from 'react-router-dom';

import {avancement_actions, fakeNotifs, avancement_contributions, avancement_members, fakeContribution, fakeMembre} from './data'
import API from '../../../utils/API'
import DashHeader from '../../../components/Backend/UserDash/DashHeader/DashHeader';
import {MembersTable, ActionTable, ContribTable} from '../../../components/Backend/UserProfile';
import FButton from '../../../components/FigmaUI/FButton/FButton';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';
import {AddMemberModal, EditMemberModal} from '../../../components/Modals/index';

import './UserDashStruct.scss';
import variables from 'scss/colors.scss';

moment.locale('fr');

const tables = [{name:'actions', component: ActionTable}, {name:'contributions', component: ContribTable}, {name:'members', component: MembersTable}];

class UserDashStruct extends Component {
  state={
    showModal:{actions:false, contributions: false, members:false, addMember: false, editMember: false}, 
    user:{},
    languesUser:[],
    traductionsFaites:[],
    progression:{
      timeSpent:0,
      nbMots:0
    },
    isMainLoading: true,
    showSections:{traductions: true},
    contributions: [],
    actions:[],
    contributeur:false,
    members:[],

    structure:{},
    users:[],
    selected:{},
  }

  componentDidMount() {
    let user=this.props.user;
    console.log(user)

    this.initializeStructure();

    API.get_users({}).then(data => this.setState({users: data.data.data}) )

    API.get_dispositif({'creatorId': user._id}).then(data => {
      console.log(data.data.data)
      this.setState({contributions: data.data.data, actions: this.parseActions(data.data.data)})
    })


    if(user && user.selectedLanguages && user.selectedLanguages.length > 0){
      API.get_langues({'_id': { $in: user.selectedLanguages}},{},'participants').then(data_langues => {
        console.log(data_langues.data.data)
        this.setState({languesUser: data_langues.data.data, isMainLoading: false})
      })
      API.get_progression().then(data_progr => {
        console.log(data_progr.data.data)
        if(data_progr.data.data && data_progr.data.data.length>0)
          this.setState({progression: data_progr.data.data[0]})
      })
      API.get_tradForReview({'_id': { $in: user.traductionsFaites}},{updatedAt: -1}).then(data => {
        console.log(data.data.data)
        this.setState({traductionsFaites: data.data.data})
      })
    }else{
      this.setState({isMainLoading:false, showModal:{...this.state.showModal, defineUser: true}})
    }
    this.setState({user:user})
    window.scrollTo(0, 0);
  }

  initializeStructure = () => {
    const user=this.props.user;
    if(user.structures && user.structures.length > 0){
      API.get_structure({_id: user.structures[0] }, {}, 'dispositifsAssocies').then(data => { console.log(data.data.data[0]);
        this.setState({structure:data.data.data[0]})
      })
    }
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
    this.setState(pS => ({showModal : {...pS.showModal, [modal]: !pS.showModal[modal]}}), ()=>(console.log(this.state)))
  }
  
  toggleSection = (section) => {
    this.props.tracking.trackEvent({ action: 'toggleSection', label: section, value : !this.state.showSections[section] });
    this.setState({showSections : {...this.state.showSections, [section]: !this.state.showSections[section]}})
  }

  triggerConfirmationRedirect = () => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Sans informations sur vos langues de travail, nous allons vous rediriger vers la page d'accueil",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Aller à l\'accueil',
      confirmButtonText: 'Je veux continuer'
    }).then((result) => {
      if (!result.value) {
        this.props.history.push("/")
      }
    })
  }
  
  openThemes = (langue) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'openThemes', value : langue._id });
    this.props.history.push({
      pathname: '/avancement/langue/'+langue._id,
      state: { langue: langue}
    })
  }

  openTraductions = (langue) => {
    this.props.tracking.trackEvent({ action: 'click', label: 'openTraductions', value : langue._id });
    this.props.history.push({
      pathname: '/avancement/traductions/'+langue._id,
      state: { langue: langue}
    })
  }

  quickAccess = (langue=null) => {
    if(!langue && this.state.languesUser.length > 0){langue=this.state.languesUser.find(x=> x.langueCode!=='fr')}
    if(!langue){return false;}
    let i18nCode=langue.i18nCode;
    let nom='avancement.'+i18nCode;
    let query ={$or : [{[nom]: {'$lt':1} }, {[nom]: null}]};
    API.getArticle({query: query, locale:i18nCode, random:true}).then(data_res => {
      let articles=data_res.data.data;
      if(articles.length===0){Swal.fire( 'Oh non', 'Aucun résultat n\'a été retourné, veuillez rééssayer', 'error')}
      else{ this.props.history.push({ pathname: '/traduction/'+ articles[0]._id, search: '?id=' + langue._id, state: { langue: langue} }) }    
    })
  }

  editProfile = () => {
    this.props.tracking.trackEvent({ action: 'click', label: 'editProfile' });
    this.props.history.push('/backend/user-form')
  }

  setUser = user => {
    API.get_langues({'_id': { $in: user.selectedLanguages}},{},'participants').then(data_langues => {
      this.setState({user, languesUser: data_langues.data.data});
      this.toggleModal('defineUser')
    })
  }

  validateObjectifs = newUser => {
    newUser={ _id: this.state.user._id, ...newUser }
    API.set_user_info(newUser).then((data) => {
      Swal.fire( 'Yay...', 'Vos objectifs ont bien été enregistrés', 'success')
      this.setState({user:data.data.data})
      this.toggleModal('objectifs')
    })
  }

  selectItem = suggestion => this.setState({selected : suggestion});

  editMember = member => {
    console.log(member)
    this.setState({selected: member});
    this.toggleModal("editMember");
  }

  addMember = () => {
    if(!this.state.selected || !this.state.structure){Swal.fire( 'Oh non!', 'Certaines informations sont manquantes', 'error'); return;}
    let structure={
      _id: this.state.structure._id,
      "$addToSet": { "membres": {userId: this.state.selected._id, roles: ["membre"] } },
    };
    API.create_structure(structure).then((data) => {
      console.log(data);
      Swal.fire( 'Yay...', 'Votre nouveau membre a bien été ajouté, merci', 'success');
      this.toggleModal("addMember")
    })
  }

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')

  render() {
    let {isMainLoading, actions, contributions, contributeur, structure, users} = this.state;
    const {user} = this.props;
    if(!contributeur){contributions= new Array(5).fill(fakeContribution)}
    
    let members = structure.membres;
    let hasMembres=true, hasNotifs= true;
    if(!members || members.length === 0){members= new Array(5).fill(fakeMembre); hasMembres=false;}
    if(actions.length === 0){actions= new Array(5).fill(fakeNotifs); hasNotifs=false;}

    const enAttente = (structure.dispositifsAssocies || []).filter(x => x.status === "En attente");
    return (
      <div className="animated fadeIn user-dash-struct">
        <DashHeader 
          isStructure
          title="Votre structure"
          ctaText="Gérer mon rôle"
          structure={structure}
          user={user}
          toggle={this.toggleModal}
          upcoming={this.upcoming}
        />
        
        {enAttente.length > 0 && 
          enAttente.map(element => (
            <div className="nouveau-contenu mt-12 mb-12" key={element._id}>
              <div className="left-side">
                <EVAIcon name="alert-triangle" fill={variables.noir} className="mr-10" />
                <b>Un nouveau contenu a été attribué à votre structure !</b>
              </div>
              <div className="middle-side">
                <b>{element.created_at ? moment(element.created_at).fromNow() : ""}</b>
              </div>
              <div className="right-side">
                <FButton tag={NavLink} to={{pathname: "/dispositif/" + element._id, state: {structure: structure} }} type="light" name="eye-outline" fill={variables.noir}>
                  Voir le contenu
                </FButton>
              </div>
            </div>
          ))}

        <ActionTable 
          dataArray={actions}
          toggleModal={this.toggleModal}
          showSuggestion={this.showSuggestion}
          upcoming={this.upcoming}
          archive={this.archiveSuggestion}
          hasNotifs={hasNotifs}
          limit={5}
          {...avancement_actions} />

        <ContribTable 
          dataArray={contributions}
          user={this.state.user}
          contributeur={contributeur}
          toggleModal={this.toggleModal}
          toggleSection={this.toggleSection}
          windowWidth={this.props.windowWidth}
          limit={5}
          hide={false}
          overlayTitle="Rédigez des nouveaux contenus"
          overlaySpan="Agi’r est une plateforme contributive, vous pouvez participer à son enrichissement"
          overlayBtn="Découvrir comment contribuer"
          overlayRedirect={false}
          {...avancement_contributions} />

        <MembersTable 
          dataArray={members}
          toggleModal={this.toggleModal}
          removeBookmark={this.removeBookmark}
          editMember={this.editMember}
          upcoming={this.upcoming}
          hasFavori={hasMembres}
          history={this.props.history}
          user={user}
          users={users}
          structure={structure}
          limit={5}
          {...avancement_members} />

        {tables.map((table, key) => {
          const TagName = table.component;
          let avancement= key === 0 ? avancement_actions : key === 1 ? avancement_contributions: avancement_members;
          return(
            <Modal isOpen={this.state.showModal[table.name]} toggle={()=>this.toggleModal(table.name)} className='modal-plus' key={key}>
              <TagName 
                dataArray={eval(table.name)}
                user={this.state.user}
                upcoming={this.upcoming}
                editMember={this.editMember}
                {...avancement} />
            </Modal>
          )}
        )}

        <AddMemberModal 
          show={this.state.showModal.addMember}
          toggle={()=>this.toggleModal("addMember")}
          users={this.state.users}
          selectItem={this.selectItem}
          addMember={this.addMember}
          selected={this.state.selected}
        />

        <EditMemberModal 
          show={this.state.showModal.editMember}
          toggle={()=>this.toggleModal("editMember")}
          user={user}
          users={this.state.users}
          selected={this.state.selected}
          structure={structure}
          initializeStructure={this.initializeStructure}
        />

        {isMainLoading &&
          <div className="ecran-protection no-main">
            <div className="content-wrapper">
              <h1 className="mb-3">Chargement...</h1>
              <Spinner color="success" />
            </div>
          </div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    langues: state.langue.langues,
    user: state.user.user,
    expertTrad: state.user.expertTrad,
  }
}

export default track({
  page: 'UserDashStruct',
})(connect(mapStateToProps)(UserDashStruct));
