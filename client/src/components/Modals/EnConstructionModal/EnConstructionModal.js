import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import './EnConstructionModal.scss'

const enConstructionModal = (props) => {
  const validateMail=()=>{
    props.toggleModal(false, props.name);
  }
  return(
    <Modal isOpen={props.show} toggle={()=>props.toggleModal(false, props.name)} className='modal-construction'>
      <ModalHeader toggle={()=>props.toggleModal(false, props.name)}>
        Encore en construction !
      </ModalHeader>
      <ModalBody>
        <p>
          Cette fonctionnalité sera disponible prochainement. 
          Vous pouvez aussi nous suggérer des choses <a className="no-decoration" href="https://agir.canny.io/admin/board/agir">par ici.</a>
        </p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" className="send-btn" onClick={()=>props.toggleModal(false, props.name)}>Entendu</Button>
      </ModalFooter>
    </Modal>
  )
}

export default enConstructionModal;