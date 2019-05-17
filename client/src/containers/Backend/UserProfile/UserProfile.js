import React, { Component } from 'react';
import track from 'react-tracking';
import { Col, Row, Card, CardBody, Progress, Table, Modal } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';

import marioProfile from '../../../assets/mario-profile.jpg';
import SVGIcon from '../../../components/UI/SVGIcon/SVGIcon';
import {colorAvancement} from '../../../components/Functions/ColorFunctions';
//import Modal from '../../../components/Modals/Modal';
import API from '../../../utils/API';
import {TradTable, ContribTable} from '../../../components/Backend/UserProfile/index';

import {data} from './data'

import './UserProfile.scss';

const avancement_langue={
  title: 'Mes traductions',
  headers: ['Titre', 'Statut', 'Progression', 'Langue', 'Ils rédigent avec moi','']
}

const avancement_contrib={
  title: 'Mes articles',
  headers: ['Titre', 'Statut', 'Progression', 'Mon rôle', 'Ils rédigent avec moi','']
}

class UserProfile extends Component {
  state={
    showModal:{traducteur: false,contributeur: false}, 
    user: {},
    traductions:[],
    contributions:[],
    langues:[],
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
        this.setState({contributions: data.data.data})
      })
      console.log(user)
      this.setState({user:user})
    })
    API.get_langues({}).then(data => this.setState({ langues: data.data.data }))
  }

  toggleModal = (modal) => {
    this.props.tracking.trackEvent({ action: 'toggleModal', label: modal, value : !this.state.showModal[modal] });
    this.setState({showModal : {...this.state.showModal, [modal]: !this.state.showModal[modal]}})
  }

  render() {
    return (
      <div className="animated fadeIn user-profile">
        <div className="profile-header">
          <NavLink to="#contributions">
            Contribution
          </NavLink>
          <NavLink to="#contributions">
            Traduction
          </NavLink>
          <NavLink to="#contributions">
            Relecture
          </NavLink>
          <NavLink to="#contributions">
            Validation
          </NavLink>
        </div>
        <div className="profile-content">
          <Row className="profile-info">
            <div className="profile-left">
              <img className="img-circle user-picture" src={marioProfile} alt="profile"/>
              <h2 className="name">Hugo Stéphan</h2>
              <h3 className="status">Contributeur ponctuel</h3>
            </div>
            <div className="feedbacks-col">
              <Card className="feedbacks-card">
                <CardBody>
                  <SVGIcon name="clapping" fill="#FFFFFF" />
                  <div className="user-feedbacks">
                    <h4>43</h4>
                    <span>utilisateurs vous remercient</span>
                  </div>
                </CardBody>
              </Card>
            </div>
            <Col className="user-col">
              <div className="float-right update-profile">
                <Icon name="edit-outline" fill="#828282" className="edit-icon" size="large"/>
                <u>Modifier mon profil</u>
              </div>
              <div className="user-data">
                <div className="d-flex data-row">
                  <div className="margin-20">
                    <Icon name="globe" fill="#3D3D3D"/>
                  </div>
                  <div>
                    <i className="flag-icon flag-icon-fr margin-12" title="fr" id="fr"></i>
                    <span className="margin-20">français</span>
                  </div>
                  <div>
                    <i className="flag-icon flag-icon-gb margin-12" title="gb" id="gb"></i>
                    <span className="margin-20">anglais</span>
                  </div>
                </div>

                <div className="d-flex data-row">
                  <div className="margin-20">
                    <Icon name="email" fill="#3D3D3D"/>
                  </div>
                  <span>hugo.stephan@interieur.gouv.fr</span>
                </div>

                <div className="d-flex data-row">
                  <div className="margin-20">
                    <Icon name="arrowhead-right" fill="#3D3D3D"/>
                  </div>
                  <span>Je suis un contributeur bénévole au sein de la DIAIR</span>
                </div>
                
                <Row className="user-stats">
                  <Col>
                    <h4>37</h4><h4 className="make-it-gray">/ 60"</h4>
                    <span>minutes passées à aider les réfugiés. Merci.</span>
                  </Col>
                  <Col>
                    <h4>345</h4><h4 className="make-it-gray">/ 500</h4>
                    <span>mots rédigés</span>
                  </Col>
                  <Col>
                    <h4>73</h4><h4 className="make-it-gray">/ 200</h4>
                    <span>mots traduits.</span>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <ContribTable 
            dataArray={this.state.contributions}
            user={this.state.user}
            toggleModal={this.toggleModal}
            limit={5}
            {...avancement_contrib} />

          <TradTable 
            dataArray={this.state.traductions}
            user={this.state.user}
            langues={this.state.langues}
            toggleModal={this.toggleModal}
            limit={5}
            {...avancement_langue} />
        </div>

        <Modal isOpen={this.state.showModal.contributeur} toggle={()=>this.toggleModal('contributeur')} className='modal-plus'>
          <ContribTable 
            dataArray={this.state.contributions}
            user={this.state.user}
            toggleModal={this.toggleModal}
            {...avancement_contrib} />
        </Modal>

        <Modal isOpen={this.state.showModal.traducteur} toggle={()=>this.toggleModal('traducteur')} className='modal-plus'>
          <TradTable 
            dataArray={this.state.traductions}
            user={this.state.user}
            langues={this.state.langues}
            toggleModal={this.toggleModal}
            {...avancement_langue} />
        </Modal>
      </div>
    );
  }
}

export default track({
  page: 'UserProfile',
})(UserProfile);
