import React from 'react';
import { Col, Row } from 'reactstrap';
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';

import './DashHeader.scss'

const dashHeader = (props) => {
  return(
    <div className="tableau-wrapper" className="dash-header">
      <Row>
        <Col>
          <h1>{props.title}</h1>
        </Col>
        <Col className="d-flex tableau-header">
          <Row className="full-width">
            <Col lg="auto" md="4" sm="6" xs="12" className="d-flex left-element">
              <h4>{props.motsRediges}</h4>
              <span>mots rédigés</span>
            </Col>
            <Col lg="auto" md="4" sm="6" xs="12" className="d-flex middle-element">
              <h4>{props.minutesPassees}</h4>
              <span>minutes passées</span>
            </Col>
            <Col lg="auto" md="4" sm="12" xs="12" className="right-element pointer">
              <div className="modifier-objectif d-inline-flex" onClick={()=>props.toggle('objectifs')}>
                <EVAIcon name="settings-2-outline" fill="#828282" className="align-right pointer" /> {' '}
                <u className="modify-obj">Modifier mon objectif</u>
              </div>
              <div className="definir-user d-inline-flex" onClick={()=>props.toggle('defineUser')}>
                <EVAIcon name="edit-outline" fill="#828282" className="align-right pointer" /> {' '}
                <u className="modify-obj">{props.ctaText}</u>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="header-indicateurs">
        <Col lg="4" md="12" sm="12" xs="12">
          <div className="inner-indicator first-indicator">
            <div className="right-side">34</div>
            <div className="left-side">
              <b>Au total</b>, 34 personnes ont bénéficiés de votre travail de traduction. Merci pour votre engagement en faveur des réfugié.es.
              <br/>
              <u className="pointer" onClick={props.upcoming}>Qui sont-ils ?</u>
            </div>
          </div>
        </Col>
        <Col lg="4" md="12" sm="12" xs="12">
          <div className="inner-indicator second-indicator">
            <div className="right-side">12</div>
            <div className="left-side">
              <b>Cette semaine</b>, 12 personnes ont bénéficiés de votre travail de traduction. 
              <br/>
              <u className="pointer" onClick={props.upcoming}>Qui sont-ils ?</u>
            </div>
          </div>
        </Col>
        <Col lg="4" md="12" sm="12" xs="12">
          <div className="inner-indicator third-indicator">
            <div className="right-side">34</div>
            <div className="left-side">
              <b>Cette semaine</b>, 8 personnes ont traduit des contenus avec vous 
              <br/>
              <u className="pointer" onClick={props.upcoming}>Échangez avec eux !</u>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default dashHeader;