import React from 'react';
import { Col, Row, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import EVAIcon from '../../UI/EVAIcon/EVAIcon';

import './ObjectifsModal.scss'

const objectifsModal = (props) => {
  return(
    <Modal isOpen={props.show} toggle={props.toggle} className='modal-objectifs'>
      <ModalHeader>
        Quel est votre objectif de contribution hebdomadaire ?
      </ModalHeader>
      <ModalBody>
        <span className="text-small">
          Ces formules vous aident à définir un niveau d’engagement pour vous-même et nous aide à mieux vous comprendre. Vous pouvez modifier vos objectifs à tout moment.
        </span>
        <Row className="obj-row">
          <Col lg="3" className={props.objectifs[0].selected ? "active" : ""} onClick={()=>props.toggleActive(0)}>
            <h3>Je n’ai pas beaucoup de temps...</h3>
            <span className="statut">Je n’ai pas beaucoup de temps...</span>
            <div className="detail">
              <div><b>30</b><span className="text-dark"> minutes</span></div>
              <div><b>300</b><span className="text-dark"> mots</span></div>
              <div><b>50</b><span className="text-dark"> mots traduits</span></div>
            </div>
          </Col>
          <Col lg="3" className={props.objectifs[1].selected ? "active" : ""} onClick={()=>props.toggleActive(1)}>
            <h3>J’ai un peu de temps</h3>
            <span className="statut">Contributeur régulier</span>
            <div className="detail">
              <div><b>60</b><span className="text-dark"> minutes</span></div>
              <div><b>600</b><span className="text-dark"> mots</span></div>
              <div><b>100</b><span className="text-dark"> mots traduits</span></div>
            </div>
          </Col>
          <Col lg="3" className={props.objectifs[2].selected ? "active" : ""} onClick={()=>props.toggleActive(2)}>
            <h3>J’ai du temps à vous accorder</h3>
            <span className="statut">Grand contributeur</span>
            <div className="detail">
              <div><b>120</b><span className="text-dark"> minutes</span></div>
              <div><b>1200</b><span className="text-dark"> mots</span></div>
              <div><b>500</b><span className="text-dark"> mots traduits</span></div>
            </div>
          </Col>
          <Col lg="3" className={props.objectifs[3].selected ? "active" : ""} onClick={()=>props.toggleActive(3)}>
            <h3>Ce projet est génial</h3>
            <span className="statut">Ambassadeur céleste</span>
            <div className="detail">
              <div><b>300</b><span className="text-dark"> minutes</span></div>
              <div><b>2000</b><span className="text-dark"> mots</span></div>
              <div><b>2000</b><span className="text-dark"> mots traduits</span></div>
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Label check>
          <Input type="checkbox" checked={props.notifyCheck} onChange={props.handleCheckChange} />{' '}
          Je ne veux pas être notifié par email si je n’atteins pas mes objectifs hebdomadaire.
        </Label>
        <Button disabled={!props.objectifs.some(x => x.selected)} color="success" className="validate-btn d-flex align-items-center" onClick={props.validateObjectifs}>
          <EVAIcon className="margin-right-8 d-inline-flex" name="checkmark-circle-outline" />
          C’est bon ! J’ai choisi.
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default objectifsModal;