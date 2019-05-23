import React, { Component } from 'react';
import track from 'react-tracking';
import { Col, Row, Button, Progress, Badge, ListGroup, ListGroupItem, 
  Card, CardHeader, CardBody, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import ReactJoyride from 'react-joyride';
import {Redirect} from 'react-router-dom'

import Widget from './Widget'
import marioProfile from '../../../assets/mario-profile.jpg'
import {languages, past_translation, steps} from './data'
import {colorAvancement, colorStatut} from '../../../components/Functions/ColorFunctions'
import AvancementTable from '../../../components/Translation/Avancement/AvancementTable';
import API from '../../../utils/API'
import './UserDash.scss';
import DashHeader from '../../../components/Backend/UserDash/DashHeader/DashHeader';

const avancement_data={
  title: 'Avancement par langue',
  headers: ['Drapeau', 'Langue', 'Avancement', 'Traducteurs actifs', 'Traduction rapide','Voir en détail'],
  data: languages
}

const past_translation_data={
  title: 'Traductions récemment effectuées',
  headers: ['Langue', 'Texte traduit','Statut', 'Depuis'],
  data: past_translation
}

class UserDash extends Component {
  state={
    showModal:{objectifs:false}, 
    images:[],
    runJoyRide:false, //penser à le réactiver !!
    user:{},
    langues:[],
    traductionsFaites:[],
    progression:{
      timeSpent:0,
      nbMots:0
    }
  }

  componentDidMount() {
    let images=[]
    var req = require.context('../../../assets/profile_pictures', false, /.*\.jpeg$/);
    req.keys().forEach(function(key){
      images.push(req(key))
    });
    this.setState({images:images})
    
    API.get_user_info().then(data_res => {
      let user=data_res.data.data;
      API.get_langues({'_id': { $in: user.selectedLanguages}},{},'participants').then(data_langues => {
        console.log(data_langues.data.data)
        this.setState({langues: data_langues.data.data})
      })
      API.get_progression().then(data_progr => {
        if(data_progr.data.data && data_progr.data.data.length>0)
          this.setState({progression: data_progr.data.data[0]})
      })
      API.get_tradForReview({'_id': { $in: user.traductionsFaites}},{},'participants').then(data => {
        console.log(data.data.data)
        this.setState({traductionsFaites: data.data.data})
      })
      this.setState({user:user})
    })
  }

  toggleModal = (modal) => {
    this.props.tracking.trackEvent({ action: 'toggleModal', label: modal, value : !this.state.showModal[modal] });
    this.setState({showModal : {...this.state.showModal, [modal]: !this.state.showModal[modal]}})
  }
  
  openThemes = (langue) => {
    console.log(langue)
    this.props.history.push({
      pathname: '/avancement/'+langue._id,
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

  quickAccess = (langue) => {
    console.log(langue)
  }

  editProfile = () => {
    this.props.tracking.trackEvent({ action: 'click', label: 'editProfile' });
    this.props.history.push('/backend/user-form')
  }

  render() {
    let {langues, traductionsFaites} = this.state;

    const ConditionalRedirect = () => {
      if (this.state.user.selectedLanguages && this.state.user.selectedLanguages.length===0) {
        return (<Redirect to={{ pathname: '/backend/user-form', state: {user: this.state.user}}} />)
      }else{return false}
    }  
    let imgSrc = (this.state.user.picture || []).secure_url || marioProfile
    const callToAction1 = (
      (this.state.user.roles || []).find(x => x.nom==='ExpertTrad') ?
        <Button block color="primary" 
          className="btn-pill"
          onClick={() => this.openTraductions((this.state.langues || [{}])[0])}>Valider des traductions</Button>
        :
        <Button block color="primary" className="btn-pill">Call to action</Button>
    )
    const buttonTraductions = element => (
      (this.state.user.roles || []).find(x => x.nom==='ExpertTrad') ?
        <Button block color="info" onClick={() => this.openTraductions(element)}>Valider les traductions</Button>
        :
        <Button block color="info" onClick={() => this.openThemes(element)}>Voir les thèmes</Button>
    )
    return (
      <div className="animated fadeIn user-dash">
        <ConditionalRedirect />
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
          motsRediges={this.state.progression.nbMots}
          minutesPassees={Math.floor(this.state.progression.timeSpent / 60)}
          motsRestants={Math.max(0,this.state.user.objectifMots - this.state.progression.nbMots)} //inutilisé pour l'instant mais je sans que Hugo va le rajouter bientôt
          minutesRestantes={Math.max(0,this.state.user.objectifTemps - Math.floor(this.state.progression.timeSpent / 60))} //idem
        />
        
        <Row>
          <AvancementTable 
            headers={past_translation_data.headers}
            title={past_translation_data.title}
            data={past_translation_data.data}
            >
            {traductionsFaites.map( element => {
              console.log(element)
              let langElem=langues.find(x=>x._id===element._id) || {};
              console.log(langElem)
              return (
                <tr 
                  key={element._id} 
                  onClick={this.navigateToDashLang}>
                  <td className="align-middle">
                    <i className={'flag-icon flag-icon-' +  langElem.langueCode + ' h1'} title={element.code} id={element.code}></i>
                    <b>{langElem.langueFr}</b>
                  </td>
                  <td className="align-middle">{element.titre}</td>
                  <td className="align-middle">
                    {element.titre}
                  </td>
                  <td className="align-middle">
                    <Badge color={colorStatut(element.statut)}>{element.statut}</Badge>
                  </td>
                </tr>
              );
            })}
          </AvancementTable>
        </Row>

        <Row>
          <AvancementTable 
            headers={avancement_data.headers}
            title={avancement_data.title}
            >
            {langues.map((element,key) => {
              return (
                <tr key={element._id} >
                  <td className="align-middle">
                    <i className={'flag-icon flag-icon-' + element.langueCode + ' h1'}></i>
                  </td>
                  <td className="align-middle">{element.langueFr}</td>
                  <td className="align-middle">
                    <div>
                      {Math.round(element.avancement * 100)} %
                    </div>
                    <Progress color={colorAvancement(element.avancement)} value={element.avancement*100} className="mb-3" />
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
                    <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                      <Button block color="success" onClick={() => this.quickAccess(element)}>Accès rapide</Button>
                    </Col>
                  </td>
                  <td className="align-middle">
                    <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                      {buttonTraductions(element)}
                    </Col>
                  </td>
                </tr>
              );
            })}
          </AvancementTable>
        </Row>


        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i><strong>Conversation en cours</strong>
              </CardHeader>
              <CardBody>
                <ListGroup>
                  <ListGroupItem active action className="justify-content-between">
                    <ListGroupItemHeading>Les 3 petits cochons</ListGroupItemHeading>
                    <ListGroupItemText>
                      Comment traduire 'maison de briques' en anglais?
                    </ListGroupItemText>
                    <Badge className="float-right" pill color="success">14</Badge>
                  </ListGroupItem>
                  <ListGroupItem action className="justify-content-between">
                    <ListGroupItemHeading>Blanche neige et les 7 nains</ListGroupItemHeading>
                    <ListGroupItemText>
                      On s'accorde sur une traduction commune du nain en espagnol ?
                    </ListGroupItemText>
                    <Badge className="float-right" pill color="info">2</Badge>
                  </ListGroupItem>
                  <ListGroupItem action className="justify-content-between">
                    <ListGroupItemHeading>Les chiens aboient quand la caravane passe</ListGroupItemHeading>
                    <ListGroupItemText>
                      Ca ressemble à un proverbe non?
                    </ListGroupItemText>
                    <Badge className="float-right" pill color="warning">1</Badge>
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default track({
  page: 'UserDash',
})(UserDash);
