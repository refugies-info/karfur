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
          <div className="d-flex left-element">
            <h4>{props.motsRediges}</h4>
            <span>mots rédigés</span>
          </div>
          <div className="d-flex middle-element">
            <h4>{props.minutesPassees}</h4>
            <span>minutes passées</span>
          </div>
          <div className="d-flex right-element pointer" onClick={()=>props.toggle('objectifs')}>
            <EVAIcon name="settings-2-outline" fill="#828282" className="align-right pointer" onClick={()=>props.toggleModal('objectifs')} /> {' '}
            <u className="modify-obj">Modifier mon objectif</u>
          </div>
        </Col>
      </Row>
      <Row className="header-indicateurs">
        <Col lg="4" className="first-indicator">
          <div className="right-side">34</div>
          <div className="left-side">
            <b>Au total</b>, 34 personnes ont bénéficiés de votre travail de traduction. Merci pour votre engagement en faveur des réfugié.es.
            <br/>
            <u className="pointer" onClick={props.upcoming}>Qui sont-ils ?</u>
          </div>
        </Col>
        <Col lg="4" className="second-indicator">
          <div className="right-side">12</div>
          <div className="left-side">
            <b>Cette semaine</b>, 12 personnes ont bénéficiés de votre travail de traduction. 
            <br/>
            <u className="pointer" onClick={props.upcoming}>Qui sont-ils ?</u>
          </div>
        </Col>
        <Col lg="4" className="third-indicator">
          <div className="right-side">34</div>
          <div className="left-side">
            <b>Cette semaine</b>, 8 personnes ont traduit des contenus avec vous 
            <br/>
            <u className="pointer" onClick={props.upcoming}>Échangez avec eux !</u>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default dashHeader;