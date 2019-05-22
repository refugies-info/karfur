import React from 'react';
import { Input, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Icon from 'react-eva-icons';

import './SuggererModal.scss'

const suggererModal = (props) => {
  let showModals=props.showModals;
  let isOpen = showModals.suggerer || showModals.question || showModals.signaler
  let name = 'suggerer', fieldName='suggestions';
  if(isOpen){
    if(showModals.question){name='question'; fieldName='questions'}
    else if(showModals.signaler){name='signaler'; fieldName='signalements'}
  }
  return(
    <Modal isOpen={isOpen} toggle={()=>props.toggleModal(false, name)} className='modal-suggerer'>
      <ModalHeader>
        <Icon name="message-circle" fill="#3D3D3D" />
        Nous vous écoutons :
      </ModalHeader>
      <ModalBody>
        <Input type="textarea" placeholder="Aa" rows={5} value={props.suggestion} onChange={props.onChange} id="suggestion" />
      </ModalBody>
      <ModalFooter>
        <Button color="dark" className="send-btn" onClick={()=>props.onValidate(name, fieldName)}>Envoyer</Button>
      </ModalFooter>
    </Modal>
  )
}

export default suggererModal;