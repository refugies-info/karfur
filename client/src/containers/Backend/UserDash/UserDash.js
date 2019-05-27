import React, { Component } from 'react';
import track from 'react-tracking';
import { Col, Row, Button, Progress, Badge, Modal } from 'reactstrap';
import ReactJoyride from 'react-joyride';
import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';

import marioProfile from '../../../assets/mario-profile.jpg'
import {languages, past_translation, steps} from './data'
import {colorAvancement, colorStatut} from '../../../components/Functions/ColorFunctions'
import AvancementTable from '../../../components/Translation/Avancement/AvancementTable';
import API from '../../../utils/API'
import DashHeader from '../../../components/Backend/UserDash/DashHeader/DashHeader';
import Icon from 'react-eva-icons/dist/Icon';
import SVGIcon from '../../../components/UI/SVGIcon/SVGIcon';
import { ObjectifsModal, TraducteurModal } from '../../../components/Modals';

import './UserDash.scss';

moment.locale('fr');

const past_translation_data={
  title: 'Traductions récemment effectuées',
  headers: ['Langue', 'Texte traduit','Statut', 'Depuis'],
  data: past_translation
}

const avancement_data={
  title: 'Progression de la traduction par langue',
  headers: ['Langue', 'Progression', 'Traducteurs mobilisés', '',''],
  data: languages
}

class UserDash extends Component {
  state={
    showModal:{objectifs:false, traductionsFaites: false, progression:false, defineUser: false}, 
    runJoyRide:false, //penser à le réactiver !!
    user:{},
    langues:[],
    allLangues:[],
    traductionsFaites:[],
    progression:{
      timeSpent:0,
      nbMots:0
    }
  }

  componentDidMount() {
    API.get_user_info().then(data_res => {
      let user=data_res.data.data;
      if(user.selectedLanguages && user.selectedLanguages.length > 0){
        API.get_langues({'_id': { $in: user.selectedLanguages}},{},'participants').then(data_langues => {
          console.log(data_langues.data.data)
          this.setState({langues: data_langues.data.data})
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
        this.setState({showModal:{...this.state.showModal, defineUser: true}})
      }
      API.get_langues().then(data_langues => { this.setState({allLangues: data_langues.data.data}) })
      this.setState({user:user})
    })
  }

  toggleModal = (modal) => {
    this.props.tracking.trackEvent({ action: 'toggleModal', label: modal, value : !this.state.showModal[modal] });
    if(modal === 'defineUser' && this.state.showModal.defineUser && (!this.state.user.selectedLanguages || this.state.user.selectedLanguages.length === 0)){
      this.triggerConfirmationRedirect();
    }else{
      this.setState({showModal : {...this.state.showModal, [modal]: !this.state.showModal[modal]}}, ()=>(console.log(this.state)))
    }
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
    if(!langue && this.state.langues.length > 0){langue=this.state.langues.find(x=> x.langueCode!=='fr')}
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
      this.setState({user, langues: data_langues.data.data});
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

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')

  render() {
    let {langues, traductionsFaites} = this.state;

    const buttonTraductions = element => (
      (this.state.user.roles || []).find(x => x.nom==='ExpertTrad') ?
        <Button block color="info" onClick={() => this.openTraductions(element)}>Valider les traductions</Button>
        :
        <Button block color="primary" className="traduire-btn" onClick={() => this.openThemes(element)}>
          <SVGIcon name="translate" fill="#FFFFFF"/>
          <span>Commencer à traduire</span>
        </Button>
    )

    const TraductionsRecentes = (props) => {
      let data = props.limit ? [...props.dataArray].slice(0,props.limit) : props.dataArray;
      return (
        <AvancementTable 
          headers={past_translation_data.headers}
          title={past_translation_data.title}
          toggleModal={()=>this.toggleModal('traductionsFaites')}
          protection={data.length === 0}
          quickAccess={this.quickAccess}
          {...props}
          >
          {data.map( element => {
            let langElem=langues.find(x=>x.i18nCode===element.langueCible) || {};
            return (
              <tr 
                key={element._id} 
                onClick={this.navigateToDashLang}>
                <td className="align-middle">
                  <i className={'flag-icon flag-icon-' +  langElem.langueCode} title={element.code} id={element.code}></i>
                  <b>{langElem.langueFr}</b>
                </td>
                <td className="align-middle text-grey">{(element.initialText || {}).title}</td>
                <td className="align-middle">
                  <Badge color={colorStatut(element.status)}>{element.status}</Badge>
                </td>
                <td className="align-middle since-col">
                  {moment(element.updatedAt).fromNow()}
                </td>
              </tr>
            );
          })}
        </AvancementTable>
      )
    }

    const ProgressionTraduction = (props) => {
      let data = props.limit ? [...props.dataArray].slice(0,props.limit) : props.dataArray;
      return (
        <AvancementTable 
          headers={avancement_data.headers}
          title={avancement_data.title}
          toggleModal={()=>this.toggleModal('progression')} 
          {...props}
          >
          {data.map( element => {
            return (
              <tr key={element._id} >
                <td className="align-middle">
                  <i className={'flag-icon flag-icon-' + element.langueCode + ' h1'} title={element.code} id={element.code}></i>
                  {element.langueFr}
                </td>
                <td className="align-middle">
                  <div>
                    {Math.round((element.avancement || 0) * 100)} %
                  </div>
                  <Progress color={colorAvancement(element.avancement)} value={(element.avancement || 0)*100} className="mb-3" />
                </td>
                <td className="align-middle">
                  {element.participants.map((participant) => {
                    return ( 
                        <img
                          key={participant._id} 
                          src={participant.picture ? participant.picture.secure_url : marioProfile} 
                          className="profile-img img-circle"
                          alt="random profiles"
                        />
                    );
                  })}
                </td>
                <td className="align-middle">
                  {element.avancement !== 1 && 
                    <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                      <Button block color="warning" className="quick-btn" onClick={() => this.quickAccess(element)}>
                        <Icon name="flash-outline" fill="#3D3D3D" />
                        <span>Aléatoire</span>
                      </Button>
                    </Col>}
                </td>
                <td className="align-middle">
                  {element.avancement !== 1 && 
                    <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                      {buttonTraductions(element)}
                    </Col>}
                </td>
              </tr>
            );
          })}
        </AvancementTable>
      )
    }

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
          title="Mes traductions"
          ctaText="Modifier mes langues de travail"
          motsRediges={this.state.progression.nbMots}
          minutesPassees={Math.floor(this.state.progression.timeSpent / 1000 / 60)}
          toggle={this.toggleModal}
          upcoming={this.upcoming}
          motsRestants={Math.max(0,this.state.user.objectifMots - this.state.progression.nbMots)} //inutilisé pour l'instant mais je sans que Hugo va le rajouter bientôt
          minutesRestantes={Math.max(0,this.state.user.objectifTemps - Math.floor(this.state.progression.timeSpent / 1000 / 60))} //idem
        />
        
        <Row className="recent-row">
          <TraductionsRecentes
            dataArray={traductionsFaites}
            limit={5} />
        </Row>

        <Row>
          <ProgressionTraduction
            dataArray={langues}
            limit={5} />
        </Row>

        <Modal isOpen={this.state.showModal.traductionsFaites} toggle={()=>this.toggleModal('traductionsFaites')} className='modal-plus'>
          <TraductionsRecentes dataArray={traductionsFaites} />
        </Modal>
        <Modal isOpen={this.state.showModal.progression} toggle={()=>this.toggleModal('progression')} className='modal-plus'>
          <ProgressionTraduction dataArray={langues} />
        </Modal>

        <ObjectifsModal 
          show={this.state.showModal.objectifs} 
          toggle={()=>this.toggleModal('objectifs')}
          validateObjectifs={this.validateObjectifs} />
        
        <TraducteurModal 
          user={this.state.user} 
          langues={this.state.allLangues}
          show={this.state.showModal.defineUser} 
          setUser={this.setUser}
          toggle={()=>this.toggleModal('defineUser')} />
      </div>
    );
  }
}

export default track({
  page: 'UserDash',
})(UserDash);
