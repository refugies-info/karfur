import React, { Component } from 'react';
import track from 'react-tracking';
import { Col, Row, Button, Progress, Badge, Modal } from 'reactstrap';
import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';

import API from '../../../utils/API'
import DashHeader from '../../../components/Backend/UserDash/DashHeader/DashHeader';
import { ObjectifsModal } from '../../../components/Modals';
import { ContribTable } from '../../../components/Backend/UserProfile';
import { avancement_contrib } from '../UserProfile/data';

import './UserDashContrib.scss';

moment.locale('fr');

class UserDashContrib extends Component {
  state={
    showModal:{objectifs:false, contibutionsFaites: false, progression:false, devenirContributeur: false}, 
    user:{},
    langues:[],
    allLangues:[],
    contributionsFaites:[],
    progression:{
      timeSpent:0,
      nbMots:0
    }
  }

  componentDidMount() {
    API.get_user_info().then(data_res => {
      let user=data_res.data.data;
      API.get_dispositif({'creatorId': user._id}).then(data => {
        this.setState({contributionsFaites: data.data.data})
      })
      API.get_progression().then(data_progr => {
        if(data_progr.data.data && data_progr.data.data.length>0)
          this.setState({progression: data_progr.data.data[0]})
      })
      this.setState({user:user, contributeur:user.roles.some(x=>x.nom==="Contrib")})
    })
  }

  toggleModal = (modal) => {  
    this.props.tracking.trackEvent({ action: 'toggleModal', label: modal, value : !this.state.showModal[modal] });
    this.setState({showModal : {...this.state.showModal, [modal]: !this.state.showModal[modal]}}, ()=>(console.log(this.state)))
  }

  validateObjectifs = newUser => {
    newUser={ _id: this.state.user._id, ...newUser }
    API.set_user_info(newUser).then((data) => {
      Swal.fire( 'Yay...', 'Vos objectifs ont bien été enregistrés', 'success')
      this.setState({user:data.data.data})
      this.toggleModal('objectifs')
    })
  }

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')
  
  render() {
    let {contributionsFaites, contributeur, user} = this.state;
    console.log(contributeur);

    return (
      <div className="animated fadeIn user-dash-contrib">
        <DashHeader 
          title="Mes contributions"
          motsRediges={this.state.progression.nbMots}
          minutesPassees={Math.floor(this.state.progression.timeSpent / 1000 / 60)}
          toggle={this.toggleModal}
          upcoming={this.upcoming}
          motsRestants={Math.max(0,this.state.user.objectifMots - this.state.progression.nbMots)} //inutilisé pour l'instant mais je sans que Hugo va le rajouter bientôt
          minutesRestantes={Math.max(0,this.state.user.objectifTemps - Math.floor(this.state.progression.timeSpent / 1000 / 60))} //idem
        />
        
        <Row className="recent-row">
          <ContribTable 
            dataArray={contributionsFaites}
            user={user}
            contributeur={contributeur}
            toggleModal={this.toggleModal}
            limit={5}
            overlayTitle="Ici, vous pourrez accéder à vos contributions"
            overlaySpan="Proposez de nouveaux contenus pour enrichir la plateforme, ou aider à corriger et à tenir à jour les contenus existants"
            overlayBtn="Commencer à rédiger"
            overlayRedirect={true}
            history={this.props.history}
            {...avancement_contrib} />
        </Row>

        <Modal isOpen={this.state.showModal.contributionsFaites} toggle={()=>this.toggleModal('contributionsFaites')} className='modal-plus'>
          <ContribTable
            dataArray={contributionsFaites} />
        </Modal>

        <ObjectifsModal 
          show={this.state.showModal.objectifs} 
          toggle={()=>this.toggleModal('objectifs')}
          validateObjectifs={this.validateObjectifs} />
        
      </div>
    );
  }
}

export default track({
  page: 'UserDashContrib',
})(UserDashContrib);
