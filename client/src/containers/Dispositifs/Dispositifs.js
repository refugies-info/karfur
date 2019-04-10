import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Button, Card, CardBody, CardFooter } from 'reactstrap';

import Modal from '../../components/Modals/Modal'
import {randomColor} from '../../components/Functions/ColorFunctions'
import API from '../../utils/API';
import femmeDispo from '../../assets/figma/femmeDispo.svg'
import hommeDispo from '../../assets/figma/hommeDispo.svg'

import './Dispositifs.scss';

class Dispositifs extends Component {
  state = {
    dispositifs:[],
    dispositif:{},
    showModal:false
  }

  componentDidMount (){
    API.get_dispositif({}).then(data_res => {
      let dispositifs=data_res.data.data
      this.setState({
        dispositifs:dispositifs, 
      })
    },function(error){console.log(error);return;})
  }

  _toggleModal = (show, dispositif = {}) => {
    this.setState({showModal:show, dispositif:dispositif})
  }

  goToDispositif = () =>{
    if(this.state.dispositif._id){
      this.props.history.push('/dispositif/'+this.state.dispositif._id)
    }else{
      this.props.history.push('/dispositif')
    }
  }

  render() {
      return (
        <div className="animated fadeIn dispositifs">
          <section id="hero">
            <div className="hero-container">
              <Row className="full-width">
                <Col lg="3">
                  <img src={femmeDispo} alt="femme"/>
                </Col>
                <Col lg="6">
                  <h1>Construire sa vie en France</h1>
                  <h2>Trouver le dispositif qui vous correspond</h2>
                  
                  <div className="input-group md-form form-sm form-1 pl-0 search-bar inner-addon right-addon">
                    <input className="form-control my-0 py-1 amber-border" type="text" placeholder="Chercher" aria-label="logement + accompagnement social" />
                    <i className="fa fa-search text-grey search-btn" aria-hidden="true"></i>
                    {/* <div className="input-group-append">
                      <span className="input-group-text amber lighten-3" id="basic-text1">
                        <i className="fa fa-search text-grey" aria-hidden="true"></i>
                      </span>
                    </div> */}
                  </div>
                </Col>
                <Col lg="3">
                  <img src={hommeDispo} alt="homme"/>
                </Col>
              </Row>
            </div>
          </section>
          <section id="menu_dispo">
            <Row className="align-items-center themes">
              <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                <Button block outline color="danger">Logement</Button>
              </Col>
              <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                <Button block outline color="primary">Français</Button>
              </Col>
              <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                <Button block outline color="warning">Insertion professionnelle</Button>
              </Col>
              <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                <Button block outline color="info">Formation professionnelle</Button>
              </Col>
              <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                <Button block outline color="success">Reprise d'études</Button>
              </Col>
              <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                <Button block outline color="secondary">Volontariat</Button>
              </Col>
              <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                <Button block outline color="dark">Accès à la nationalité</Button>
              </Col>
              <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                <span className="toggler active" data-toggle="grid"><span className="fa fa-th-large" /></span>
                <span className="toggler" data-toggle="list"><span className="fa fa-th-list" /></span>{/*  or use entypo library from weloveicons */}
              </Col>
            </Row>
            <Row>
              {this.state.dispositifs.map((dispositif) => {
                return (
                  <Col xs="9" sm="4" md="3" key={dispositif._id}>
                    <Card className="custom-card" onClick={()=>this._toggleModal(true,dispositif)}>
                      <CardBody>
                        <h3>{dispositif.titreInformatif}</h3>
                        <p>{dispositif.abstract}</p>
                      </CardBody>
                      <CardFooter className={"align-right bg-"+randomColor()}>{dispositif.titreMarque}</CardFooter>
                    </Card>
                  </Col>
                )}
              )}
              <Col xs="9" sm="4" md="3">
                <Card className="custom-card add-card" onClick={this.goToDispositif}>
                  <CardBody>
                    <span className="add-sign">+</span>
                  </CardBody>
                  <CardFooter className={"align-right bg-secondary"}>Créer un nouveau dispositif</CardFooter>
                </Card>
              </Col>
            </Row>
          </section>

          <Modal show={this.state.showModal} modalClosed={()=>this._toggleModal(false)} classe='modal-dispo'>
            <div className="left-text">
              <h3>Faire son service civique</h3>
              <p>Avec le programme <i>Volont'r</i></p>
            </div>
            <Button block color="info" className="right-button">Formation professionnelle</Button>
            <footer className='modal-footer'>
              <Button outline color="success" size="lg" block onClick={this.goToDispositif}>Y accéder</Button>
            </footer>
          </Modal>
        </div>
      )
  }
}

export default track({
    page: 'Dispositifs',
  })(
    withTranslation()(Dispositifs)
  );

