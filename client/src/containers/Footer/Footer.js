import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import { Row, Col, Form, FormGroup, Label, Input, InputGroupAddon } from 'reactstrap';
import Swal from 'sweetalert2';

import Logo from '../../components/Logo/Logo';
import API from '../../utils/API';

import './Footer.scss';
import variables from 'scss/colors.scss';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';
import FButton from '../../components/FigmaUI/FButton/FButton';

class Footer extends Component {
  state = {
    email: ""
  }

  onChange = e => this.setState({email: e.target.value});

  sendMail = (e) => {
    e.preventDefault();
    if(!this.state.email){ Swal.fire( {title: 'Oops...', text: 'Aucun mail renseigné', type: 'error', timer: 1500});return;}
    API.set_mail({mail: this.state.email}).then(() => {
      Swal.fire( {title: 'Yay...', text: 'Mail correctement enregistré !', type: 'success', timer: 1500});
      this.setState({email:""})
    }).catch(e=>Swal.fire( 'Oh non...', 'Une erreur s\'est produite', 'error'));
  }    

  upcoming = () => Swal.fire( {title: 'Oh non!', text: 'Cette fonctionnalité n\'est pas encore disponible', type: 'error', timer: 1500 })

  render() {
    // const { t } = this.props;
    return (
      <div className="animated fadeIn footer">
        <Row>
          <Col lg="4">
            <Logo />
            <Form onSubmit={this.sendMail}>
              <FormGroup>
                {/*<Label for="emailNewsletter">Rejoindre la newsletter</Label>*/}
                <div className="position-relative">
                  <Input 
                    type="email" 
                    name="email" 
                    value={this.state.email}
                    onChange={this.onChange}
                    id="emailNewsletter" 
                    placeholder="Je m'abonne à la newsletter" />
                  <InputGroupAddon addonType="append" className="icon-append" onClick={this.sendMail}>
                    <EVAIcon name='at-outline' fill={variables.noir} />
                  </InputGroupAddon>
                </div>
              </FormGroup>
            </Form>
            <div className="ligne-footer">
              {/*<label>Rejoindre la newsletter</label>*/}
              <FButton tag={"a"} href="https://agi-r.mn.co" target="_blank" className="footer-btn" type="light-action" name="people-outline" fill={variables.noir}>
                Rejoindre le réseau
              </FButton>
            </div>
            <div className="ligne-footer">
              {/*<label>Demander de nouveaux contenus</label>*/}
              <FButton tag={"a"} href="https://agir.canny.io/agir" target="_blank" className="footer-btn" type="light-action" name="plus-circle-outline" fill={variables.noir}>
                Suggérer des fonctionnalités
              </FButton>
            </div>
          </Col>
          <Col lg="8" className="right-col">
            <Row className="main-row">
              <Col lg="4">
                <h5 className="footer-header">
                  Le projet
                </h5>
                <div className="lien-footer">
                  <NavLink to="/qui-sommes-nous">Qui sommes-nous ?</NavLink>
                </div>
                <div className="lien-footer">
                  <NavLink to="/comment-contribuer">Comment contribuer ?</NavLink>
                </div>
                <div className="lien-footer" onClick={this.upcoming}>
                  <NavLink to="/">Accessibilité</NavLink>
                </div>
                <div className="lien-footer" onClick={this.upcoming}>
                  <NavLink to="/">Mentions légales</NavLink>
                </div>
              </Col>
              <Col lg="8">
                <h5 className="footer-header">
                  Vous cherchez ?
                </h5>
                <div className="lien-footer">
                  <NavLink to="/advanced-search">
                    <b>Dispositif</b> - Être accompagné ou rejoindre un dispositif
                  </NavLink>
                </div>
                <div className="lien-footer">
                  <NavHashLink to="/homepage#plan" smooth>
                    <b>Démarches</b> - Comprendre mes démarches administratives
                  </NavHashLink>
                </div>
                <div className="lien-footer">
                  <NavHashLink to="/homepage#plan" smooth>
                    <b>Parcours</b> - Créer mon parcours d’intégration
                  </NavHashLink>
                </div>
                <div className="lien-footer">
                  <NavHashLink to="/homepage#explique">
                    <b>Lexique</b> - Comprendre un mot
                  </NavHashLink>
                </div>
              </Col>
            </Row>
            <Row className="social-custom-buttons-row">
              <Col lg="4">
                <FButton disabled onClick={this.upcoming} type="light-action" name="twitter-outline" fill={variables.noir}>
                  Nous suivre sur Twitter
                </FButton>
              </Col>
              <Col lg="4">
                <FButton disabled onClick={this.upcoming} type="light-action" name="facebook-outline" fill={variables.noir}>
                  Suivre sur Facebook
                </FButton>
              </Col>
              <Col lg="4">
                <FButton disabled onClick={this.upcoming} type="light-action" name="message-circle-outline" fill={variables.noir}>
                  Suivre sur Whatsapp
                </FButton>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default track({
  page: 'Footer',
})(
  withTranslation()(Footer)
);