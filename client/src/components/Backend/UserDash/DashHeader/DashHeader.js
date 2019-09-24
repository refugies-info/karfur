import React from 'react';
import { Col, Row } from 'reactstrap';
import {NavLink} from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';

import FButton from '../../../FigmaUI/FButton/FButton';
import {diairMinInt} from '../../../../assets/figma/index'

import './DashHeader.scss'
import variables from 'scss/colors.scss';

moment.locale('fr');

const dashHeader = (props) => {
  const roles = (((props.structure || {}).membres || []).find(x => x.userId === props.user._id) || {}).roles || [];
  let role = roles.includes("administrateur") ? "administrateur" :
              roles.includes("createur") ? "créateur" :
              roles.includes("contributeur") ? "contributeur" :
              "membre";

  const IndicateursBloc = props => {
    if(props.isStructure){
      const structure = props.structure || {};
      const nbTraducteurs = [...new Set((props.traductions || []).reduce((acc, curr) => ([...acc, curr.userId, curr.validatorId]),[]).filter(x => x))].length;
      const sommeDates=(structure.dispositifsAssocies || []).map(x => x.updatedAt).reduce((acc, curr) => acc += moment(curr), 0);
      const moyenneDate = sommeDates / (structure.dispositifsAssocies || []).length
      return (
        <Row className="header-structure">
          <Col lg="6" md="12" sm="12" xs="12">
            <Row className="titre-structure">
              <Col lg="6" md="6" sm="6" xs="6">
                <div className="img-wrapper">
                  <img src={(structure.picture || {}).secure_url ||  diairMinInt} className="logo-img" alt="logo-img" />
                </div>
              </Col>
              <Col lg="6" md="6" sm="6" xs="6" className="right-side">
                <h5>
                  {structure.nom}
                </h5>
                {/* <FButton type="dark" name="edit-outline" className="bottom-btn">
                  Modifier
                </FButton> */}
              </Col>
            </Row>
          </Col>
          <Col lg="6" md="12" sm="12" xs="12" className="right-side-header">
            <Row>
              <Col lg="4">
                <div className="indicateur">
                  <h2>{(structure.dispositifsAssocies || []).length}</h2>
                  <div>contenu{(structure.dispositifsAssocies || []).length > 1 ? "s" : ""}</div>
                </div>
              </Col>
              <Col lg="4">
                <div className="indicateur">
                  <h2>{nbTraducteurs}</h2>
                  <div>traducteur{nbTraducteurs>1?"s":""} mobilisé{nbTraducteurs>1?"s":""}</div>
                </div>
              </Col>
              <Col lg="4">
                <div className="indicateur">
                  <h2>{(structure.membres || []).length}</h2>
                  <div>membre{(structure.membres || []).length>1?"s":""}</div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="4">
                <div className="indicateur">
                  <h2>{props.actions.length}</h2>
                  <div>notification{props.actions.length>1?"s":""}</div>
                </div>
              </Col>
              <Col lg="4">
                <div className="indicateur">
                  <h2>{props.nbRead}</h2>
                  <div>personne{props.nbRead>1?"s":""} informée{props.nbRead>1?"s":""}</div>
                </div>
              </Col>
              {moyenneDate &&
                <Col lg="4">
                  <div className="indicateur">
                    <h4>{moment(moyenneDate).fromNow()}</h4>
                    <div>moyenne des dernières intéractions</div>
                  </div>
                </Col>}
            </Row>
          </Col>
        </Row>
      )
    }else{
      return (
        <Row className="header-indicateurs">
          <Col lg="4" md="12" sm="12" xs="12">
            <div className="inner-indicator first-indicator">
              <h3 className="right-side">12</h3>
              <div className="left-side">
                <b className="mot-indicateur">utilisateurs</b> ont profité de vos contenus cette semaine.{' '}<br/>
                <i>Ça fait plaisir !</i>
              </div>
            </div>
          </Col>
          <Col lg="4" md="12" sm="12" xs="12">
            <div className="inner-indicator second-indicator">
              <h3 className="right-side">{props.motsRediges || 0} <span className="gris">/ {props.objectifMots || 0}</span></h3>
              <div className="left-side">
              <b className="mot-indicateur">mots</b> à traduire pour atteindre votre objectif.{' '}<br/>
              <i>Courage !</i>
              </div>
            </div>
          </Col>
          <Col lg="4" md="12" sm="12" xs="12">
            <div className="inner-indicator third-indicator">
              <h3 className="right-side">{props.minutesPassees || 0} <span className="gris">/ {props.objectifTemps || 0}h</span></h3>
              <div className="left-side">
              <b className="mot-indicateur">minutes</b> dédiées à l'accueil des personnes réfugiés.{' '}<br/>
                <i>Merci !</i>
              </div>
            </div>
          </Col>
        </Row>
      )
    }
  }
  return(
    <div className="dash-header">
      <Row>
        <Col>
          <h2 className="ariane" ><NavLink to="/backend/user-profile" className="my-breadcrumb">Mon profil</NavLink> / {props.title}</h2>
        </Col>
        <Col className="tableau-header align-right">
          {props.structure &&
            <b className="role">Vous êtes {role}</b>}
          <FButton type="outline-black" name="info-outline" fill={variables.noir} className="mr-10">
            Aide
          </FButton>
          {props.ctaText && 
            <FButton type="dark" name="options-2-outline" onClick={()=>props.toggle('objectifs')}>
              {props.ctaText}
            </FButton>}
          {props.contributeur &&
            <FButton tag={NavLink} to="/dispositif" type="dark" name="plus-circle-outline" className="ml-10">
              Créer un contenu
            </FButton>}
          {props.traducteur &&
            <FButton type="dark" name="done-all-outline" className="ml-10" onClick={()=>props.toggle('defineUser')}>
              Modifier mes langues
            </FButton>}
        </Col>
      </Row>
      <IndicateursBloc {...props} />
    </div>
  )
}

export default dashHeader;