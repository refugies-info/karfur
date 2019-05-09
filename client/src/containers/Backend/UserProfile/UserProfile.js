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
import TradTable from '../../../components/Backend/UserProfile/TradTable/TradTable';

import {data} from './data'

import './UserProfile.scss';

const avancement_data={
  title: 'Mes contributions',
  headers: ['Titre', 'Statut', 'Progression', 'Mon rôle', 'Ils rédigent avec moi','Voir en détail'],
  data: data
}

class UserProfile extends Component {
  state={
    showModal:false,
    user: {},
    traductions:[],
  }

  componentDidMount() {
    API.get_user_info().then(data_res => {
      let user=data_res.data.data;
      API.get_tradForReview({'userId': user._id}).then(data => {
        console.log(data.data.data)
        this.setState({traductions: data.data.data})
      },(error) => {console.log(error);return;})
      console.log(user)
      this.setState({user:user})
    },(error) => {console.log(error);return;})
  }

  toggleModal = () => this.setState({showModal : !this.state.showModal})

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
            <Col lg="4" className="profile-left">
              <img className="img-circle user-picture" src={marioProfile} alt="profile"/>
              <h2 className="name">Hugo Stéphan</h2>
              <h3 className="status">Contributeur ponctuel</h3>
            </Col>
            <Col lg="2" className="feedbacks-col">
              <Card className="feedbacks-card">
                <CardBody>
                  <SVGIcon name="clapping" />
                  <div className="user-feedbacks">
                    <h4>43</h4>
                    <span>utilisateurs vous remercient</span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
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

          <div className="tableau-wrapper" id="contributions">
            <h1>Mes contributions</h1>
            <div className="float-right update-profile">
              <Icon name="edit-outline" fill="#828282" className="edit-icon" size="large"/>
              <u>Changer mes objectifs</u>
            </div>

            <div className="tableau">
              <div className="d-flex tableau-header">
                <div className="left-element">
                  <h4 className="make-it-green">345</h4><h4>/ 500</h4>
                  <span>mots rédigés</span>
                </div>
                <div className="middle-element">
                  <h4>34</h4>
                  <span>minutes passées</span>
                </div>
                <div className="right-element">
                  <h4>22</h4>
                  <span>personnes ont profité de votre contribution</span>
                </div>
              </div>

              <Table responsive striped className="avancement-user-table">
                <thead>
                  <tr>
                    {avancement_data.headers.map((element,key) => {
                      return (
                        <th key={key}>{element}</th>
                      )}
                    )}
                  </tr>
                </thead>
                <tbody>
                  {avancement_data.data.map((element,key) => {
                    return (
                      <tr key={key} >
                        <td className="align-middle">
                          Faire son service civique en France
                        </td>
                        <td className="align-middle">Publié</td>
                        <td className="align-middle">
                          <Row>
                            <Col>
                              <Progress color={colorAvancement(element.avancement)} value={element.avancement*100} className="mb-3" />
                            </Col>
                            <Col className={'text-'+colorAvancement(element.avancement)}>
                              {Math.round(element.avancement * 100)} %
                            </Col>
                          </Row>
                        </td>
                        <td className="align-middle">
                          <Icon name={element.role==='Contributeur' ? "people-outline" : "shield-outline"} fill="#3D3D3D" size="large"/>&nbsp;
                          {element.role}
                        </td>
                        <td className="align-middle">
                          {element.participants && element.participants.map((participant) => {
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
                          <Icon name="eye-outline" fill="#3D3D3D" size="large"/>&nbsp;
                          <u>Voir</u>
                        </td>
                      </tr>
                    );
                  })}
                  <tr >
                    <td colSpan="6" className="align-middle voir-plus" onClick={this.toggleModal}>
                      <Icon name="expand-outline" fill="#3D3D3D" size="large"/>&nbsp;
                      Voir plus
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>



          <TradTable 
            traductions={this.state.traductions}
            user={this.state.user}
            toggleModal={this.toggleModal}
            limit={5}
            {...avancement_data} />
        </div>


        <Modal isOpen={this.state.showModal} toggle={this.toggleModal} className='modal-plus'>
          <TradTable 
              traductions={this.state.traductions}
              user={this.state.user}
              toggleModal={this.toggleModal}
              {...avancement_data} />
        </Modal>
      </div>
    );
  }
}

export default track({
  page: 'UserProfile',
})(UserProfile);
