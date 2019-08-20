import React from 'react';
import { Col, Row, Card, CardBody, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Icon from 'react-eva-icons';

import SVGIcon from '../../UI/SVGIcon/SVGIcon';

import './ReagirModal.scss'

const reagirModal = (props) => {
  const goTo=(newModalName)=>{
    props.toggleModal(true, newModalName);
    props.toggleModal(false, props.name);
  }
  return(
    <Modal isOpen={props.show} toggle={()=>props.toggleModal(false, props.name)} className='modal-reagir'>
      <ModalHeader toggle={()=>props.toggleModal(false, props.name)}>
        <Icon name="message-circle" fill="#3D3D3D" />
        Réagir
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col className="narrow-padding">
            <Card className="comment-modal">
              <CardBody>
                <div className="texte">
                  Je veux juste vous dire...
                </div>
                <div className="feedback-buttons">
                  <Button color="dark" onClick={()=>props.onValidate(props.name, 'merci')}>
                    Merci ! <span role="img" aria-label="merci">🙏</span>
                  </Button>
                  <Button color="dark" onClick={()=>props.onValidate(props.name, 'bravo')}>
                    Bravo ! <span role="img" aria-label="bravo">😊</span>
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="narrow-padding">
            <Card className="comment-modal pointy-end" onClick={()=>goTo('suggerer')}>
              <CardBody>
                <div className="texte">
                  J'ai une suggestion !
                </div>
                <div className="icone">
                  <SVGIcon
                    name="idea" 
                    alt="idea" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="narrow-padding">
            <Card className="comment-modal pointy-end" onClick={()=>goTo('question')}>
              <CardBody>
                <div className="texte">
                  J'ai une question
                </div>
                <div className="icone">
                  <SVGIcon
                    name="question" 
                    alt="question" />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default reagirModal;