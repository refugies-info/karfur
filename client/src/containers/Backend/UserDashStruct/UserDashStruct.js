/* eslint no-eval: 0 */
import React, { Component } from 'react';
import track from 'react-tracking';
import { Modal, Spinner } from 'reactstrap';
import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import {NavLink} from 'react-router-dom';
import windowSize from 'react-window-size';

import {avancement_actions, fakeNotifs, avancement_contributions, avancement_members, fakeContribution, fakeMembre} from './data'
import API from '../../../utils/API';
import DashHeader from '../../../components/Backend/UserDash/DashHeader/DashHeader';
import {MembersTable, ActionTable, ContribTable} from '../../../components/Backend/UserProfile';
import FButton from '../../../components/FigmaUI/FButton/FButton';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';
import {AddMemberModal, EditMemberModal, SuggestionModal} from '../../../components/Modals';
import {showSuggestion, archiveSuggestion, parseActions, deleteContrib} from '../UserProfile/functions';
import {selectItem, editMember, addMember} from './functions';

import './UserDashStruct.scss';
import variables from 'scss/colors.scss';

moment.locale('fr');

const tables = [{name:'actions', component: ActionTable}, {name:'contributions', component: ContribTable}, {name:'members', component: MembersTable}];

class UserDashStruct extends Component {
  constructor(props) {
    super(props);
    this.showSuggestion = showSuggestion.bind(this);
    this.archiveSuggestion = archiveSuggestion.bind(this);
    this.selectItem = selectItem.bind(this);
    this.editMember = editMember.bind(this);
    this.addMember = addMember.bind(this);
    this.deleteContrib = deleteContrib.bind(this);
  }
  
  state={
    showModal:{actions:false, contributions: false, members:false, addMember: false, editMember: false, suggestion: false}, 
    languesUser:[],
    traductionsFaites:[],
    progression:{
      timeSpent:0,
      nbMots:0
    },
    isMainLoading: true,
    showSections:{contributions: true},
    contributions: [],
    actions:[],
    members:[],

    structure:{},
    users:[],
    selected:{},
    suggestion:{},
  }

  componentDidMount() {
    let user=this.props.user;
    console.log(user)
    if(!user.structures || !user.structures.length > 0){ Swal.fire( 'Oh non', "Nous n'avons aucune information sur votre structure d'affiliation, vous allez être redirigé vers la page d'accueil", 'error').then(() => this.props.history.push("/") ); return; }

    this.initializeStructure();
    API.get_users({}).then(data => this.setState({users: data.data.data}) )

    API.get_dispositif({'mainSponsor': user.structures[0], status: {$ne: "Supprimé"} }).then(data => {console.log(data.data.data)
      this.setState({contributions: data.data.data, actions: parseActions(data.data.data)})
    })
    window.scrollTo(0, 0);
  }

  initializeStructure = () => {
    const user=this.props.user;
    API.get_structure({_id: user.structures[0] }, {}, 'dispositifsAssocies').then(data => { console.log(data.data.data[0]);
      this.setState({structure:data.data.data[0], isMainLoading:false});
    })
  }

  toggleModal = (modal) => {
    this.props.tracking.trackEvent({ action: 'toggleModal', label: modal, value : !this.state.showModal[modal] });
    this.setState(pS => ({showModal : {...pS.showModal, [modal]: !pS.showModal[modal]}}) )
  }
  
  toggleSection = (section) => {
    this.props.tracking.trackEvent({ action: 'toggleSection', label: section, value : !this.state.showSections[section] });
    this.setState({showSections : {...this.state.showSections, [section]: !this.state.showSections[section]}})
  }

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')

  render() {
    let {isMainLoading, actions, contributions, structure, users} = this.state;
    const {user} = this.props;

    let members = structure.membres;
    let hasMembres=true, hasNotifs= true, contributeur=true;
    if(actions.length === 0){actions= new Array(5).fill(fakeNotifs); hasNotifs=false;}
    if(contributions.length === 0){contributions= new Array(5).fill(fakeContribution); contributeur=false;}
    if(!members || members.length === 0){members= new Array(5).fill(fakeMembre); hasMembres=false;}

    const enAttente = (structure.dispositifsAssocies || []).filter(x => x.status === "En attente");
    return (
      <div className="animated fadeIn user-dash-struct">
        <DashHeader 
          isStructure
          title="Votre structure"
          // ctaText="Gérer mon rôle"
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
          type="structure"
          dataArray={contributions}
          user={user}
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
          history={this.props.history}
          deleteContrib = {this.deleteContrib}
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
                type="structure"
                dataArray={eval(table.name)}
                user={user}
                upcoming={this.upcoming}
                showSuggestion={this.showSuggestion}
                archive={this.archiveSuggestion}
                editMember={this.editMember}
                history={this.props.history}
                users={users}
                deleteContrib = {this.deleteContrib}
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

        <SuggestionModal suggestion={this.state.suggestion} show={this.state.showModal.suggestion} toggle={()=>this.toggleModal('suggestion')} />

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
})(connect(mapStateToProps)(
  windowSize(UserDashStruct)
));
