import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { Row, Col, Card, CardHeader, CardBody, CardFooter } from 'reactstrap'

////////A enlever si pas utilisé/////////////:
import Notifications from '../../components/UI/Notifications/Notifications';
// import SendToMessenger from './SendToMessenger';
import MessengerSendToMessenger from '../../utils/MessengerSendToMessenger';
import API from '../../utils/API';
import { toggle_lang_modal } from '../../Store/actions/index';
import SVGIcon from "../../components/UI/SVGIcon/SVGIcon"
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';
import FButton from '../../components/FigmaUI/FButton/FButton';
import {equipe} from '../../assets/figma/index';

import './QuiSommesNous.scss';
import variables from 'scss/colors.scss';

class QuiSommesNous extends Component {
  render() {
    return (
      <div className="animated fadeIn qui-sommes-nous">
        <section id="hero">
          <div className="hero-container">
            <h1>Qui sommes-nous ?</h1>
            <h4>Agi’r est une plateforme numérique dédiée à faciliter les parcours d’intégration des réfugiés en France.</h4>
          </div>
          <EVAIcon className="arrowhead-icon" name="arrowhead-down-outline" fill={variables.noir} />
        </section>

        <section id="missions">
          <div className="section-container">
            <h2>Missions</h2>

            <Row className="card-row">
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>Créer des parcours personnalisés d’intégration</CardHeader>
                  <CardBody>
                    <span>Obtenir l’asile, c’est surtout reconstruire. Un chez soi, un réseau, une vocation. Le déracinement a souvent brouillé les repères, les ambitions, les objectifs. Agi’r propose un outil structurant l’action et permettant aux réfugiés d’atteindre plus vite et plus sereinement ses objectifs de vie.</span>
                  </CardBody>
                  <CardFooter>
                    <FButton type="outline">
                      Créer mon parcours
                    </FButton>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>Vulgariser et traduire les démarches administratives</CardHeader>
                  <CardBody>
                    <span>Dès la protection obtenue, les personnes réfugiées entre dans le droit commun et bénéficie des mêmes droits sociaux que tous les français. Cette situation engendre de nombreuses démarches administratives. Agi’r produit des fiches pratiques pour vulgariser ces démarches et les proposent dans plus de 10 langues.</span>
                  </CardBody>
                  <CardFooter>
                    <FButton type="outline">
                      Chercher une démarche
                    </FButton>
                  </CardFooter>
                </Card>
              </Col>
              <Col lg="4" className="card-col">
                <Card>
                  <CardHeader>Recenser les nombreuses initiatives sur le territoire</CardHeader>
                  <CardBody>
                    <span>Des milliers de personnes s’engagent au quotidien en France pour accueillir et accompagner les personnes réfugiées. Leurs actions, humbles et ambitieuses, souffrent parfois d’un manque de visibilité et ne profitent pas au plus grand nombre. Agi’r souhaite recenser et rendre accessible ces milliers d’initative</span>
                  </CardBody>
                  <CardFooter>
                    <FButton type="outline">
                      Chercher un dispositif
                    </FButton>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </div>
        </section>
        <section id="missions">
          <div className="section-container">
            <h2>Missions</h2>
            <Row>
              <Col>
                Alain
              </Col>
            </Row>
            <img src={equipe} />
          </div>      
        </section>
      </div>
    );
  }
}

export default track({
  page: 'QuiSommesNous',
})(withTranslation()(QuiSommesNous));