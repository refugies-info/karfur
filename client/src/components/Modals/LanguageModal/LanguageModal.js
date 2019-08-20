import React from 'react';
import { Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem, Row, Col, Progress } from 'reactstrap';
import Icon from 'react-eva-icons';

import {colorAvancement} from '../../Functions/ColorFunctions';

import './LanguageModal.scss';

const languageModal = (props) => {
  if(props.show){
    return(
      <Modal isOpen={props.show} toggle={props.toggle} className="language-modal">
        <ModalHeader toggle={props.toggle}>
          <span className="title">Je choisis ma langue de lecture</span>
          {/* <NavLink to={{ pathname: '/login', state: {traducteur: true, redirectTo:"/backend/user-dashboard"} }} className="subtitle">
            Aider à traduire
          </NavLink> */}
          <div className="sous-titre">Cette page est disponible dans les langues suivantes :</div>
        </ModalHeader>
        <ModalBody>
          <ListGroup>
            {Object.keys(props.languages).map((element) => {
              return (
                <ListGroupItem action 
                  key={props.languages[element]._id} 
                  disabled={!props.languages[element].avancement}
                  onClick={() => props.changeLanguage(props.languages[element].i18nCode)}>
                  <Row>
                    <Col lg="1">
                      <i className={'flag-icon flag-icon-' + props.languages[element].langueCode} title={props.languages[element].langueCode} id={props.languages[element].langueCode}></i>
                    </Col>
                    <Col lg="5">
                      <span><b>{props.languages[element].langueFr}</b> - {props.languages[element].langueLoc}</span>
                    </Col>
                    <Col lg="5" className="progress-col">
                      <Progress color={colorAvancement(props.languages[element].avancement)} value={props.languages[element].avancement*100} />
                      <span>{Math.round(props.languages[element].avancement*100 || 0,0) + ' %'}</span>
                    </Col>
                    <Col lg="1" className="icon-col">
                      {props.languages[element].i18nCode === props.current_language &&
                        <Icon name="checkmark-circle-2" fill="#3D3D3D" /> }
                    </Col>
                  </Row>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </ModalBody>
      </Modal>
    )
  }else{return false} 
}

export default languageModal;