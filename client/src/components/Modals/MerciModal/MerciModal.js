import React from 'react';
import { Input, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import {NavLink} from 'react-router-dom';

import './MerciModal.scss'

const merciModal = (props) => {
  const validateMail=()=>{
    props.toggleModal(false, props.name);
  }
  return(
    <Modal isOpen={props.show} toggle={()=>props.toggleModal(false, props.name)} className='modal-merci'>
      <ModalHeader>
        Merci !
      </ModalHeader>
      <ModalBody>
        <p>
          Donnez-nous votre email pour être informé de notre réponse, ou&nbsp;
          <NavLink to={{ pathname:'/register', state: {redirectTo : window.location.pathname} }} className="no-decoration">créez-vous un compte</NavLink> :
        </p>
        <Input type="text" placeholder="email" value={props.suggestion} onChange={props.onChange} id="email" className="mail-input" />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" className="send-btn" onClick={validateMail}>Envoyer</Button>
      </ModalFooter>
    </Modal>
  )
}

export default merciModal;