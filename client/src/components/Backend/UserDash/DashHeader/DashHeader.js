import React from 'react';
import { Col, Row } from 'reactstrap';
import {NavLink} from 'react-router-dom';

import FButton from '../../../FigmaUI/FButton/FButton';

import './DashHeader.scss'
import variables from 'scss/colors.scss';

const dashHeader = (props) => {
  return(
    <div className="dash-header">
      <Row>
        <Col>
          <h2><NavLink to="/backend/user-dash-contrib" className="my-breadcrumb">Mon profil</NavLink> / {props.title}</h2>
        </Col>
        <Col className="tableau-header align-right">
          <FButton type="outline-black" name="info-outline" fill={variables.noir} className="mr-10">
            Aide
          </FButton>
          <FButton type="dark" name="options-2-outline">
            Mes objectifs
          </FButton>
        </Col>
      </Row>
      <Row className="header-indicateurs">
        <Col lg="4" md="12" sm="12" xs="12">
          <div className="inner-indicator first-indicator">
            <h3 className="right-side">12</h3>
            <div className="left-side">
              utilisateurs ont profité de vos contenus cette semaine.{' '}
              <b className="pointer" onClick={props.upcoming}>Alors ?</b>
            </div>
          </div>
        </Col>
        <Col lg="4" md="12" sm="12" xs="12">
          <div className="inner-indicator second-indicator">
            <h3 className="right-side">{props.motsRediges} <span className="gris">/ {props.objectifMots}</span></h3>
            <div className="left-side">
              Il vous reste {props.motsRestants} mots à traduire pour atteindre votre objectif. Courage !
            </div>
          </div>
        </Col>
        <Col lg="4" md="12" sm="12" xs="12">
          <div className="inner-indicator third-indicator">
            <h3 className="right-side">{props.minutesPassees} <span className="gris">/ {props.objectifTemps}'</span></h3>
            <div className="left-side">
              Déjà {props.minutesPassees} minutes écoulées sur les {props.objectifTemps} que vous dédiez aux réfugiés.{' '}
              <b>Merci !</b>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default dashHeader;