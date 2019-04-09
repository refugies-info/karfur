import React from 'react';
import { Col, Row, Card, CardBody } from 'reactstrap';

import Modal from '../Modal';
import SVGIcon from '../../UI/SVGIcon/SVGIcon';
import smiley from '../../../assets/figma/smiley.svg';
import puzzle from '../../../assets/figma/puzzle.svg';

import './ReagirModal.scss'

const reagirModal = (props) => {
  return(
    <Modal show={props.modal.show} modalClosed={()=>props.toggleModal(false)} classe='modal-reagir'>
      <Row>
        <Col lg="1">
          <SVGIcon 
            name="bubble" 
            fill='#3D3D3D'
            className='icon-toolbar'/>
        </Col>
        <Col lg="11">
          Réagir
        </Col>
      </Row>
      <br />
      <Row>
        <Col className="narrow-padding">
          <Card className="comment-modal">
            <CardBody>
              <div className="icone">
                <img src={smiley} alt="smiley"/>
              </div>
              <div className="texte">
                Vous remercier ou râler
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col className="narrow-padding">
          <Card className="comment-modal">
            <CardBody>
              <div className="icone">
                <SVGIcon
                  name="handwriting" 
                  fill='white'
                  alt="handwriting" />
              </div>
              <div className="texte">
                Vous proposer une meilleure formulation
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col className="narrow-padding">
          <Card className="comment-modal">
            <CardBody>
              <div className="icone">
                <img src={puzzle} alt="puzzle"/>
              </div>
              <div className="texte">
                Signaler un manque ou proposer un ajout
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Modal>
  )
}

export default reagirModal;