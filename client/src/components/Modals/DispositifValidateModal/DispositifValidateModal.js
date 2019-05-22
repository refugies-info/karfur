import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from 'reactstrap';
import Icon from 'react-eva-icons';

import './DispositifValidateModal.scss'

const dispositifValidateModal = (props) => {
  const validateAndClose = () => {
    props.validate();
    props.toggle();
  }
  return(
    <Modal isOpen={props.show} toggle={props.toggle} className="dispositif-validate-modal">
      <ModalHeader>
        Un dernier effort !
      </ModalHeader>
      <ModalBody>
        <p>Merci d’ajouter une phrase explicative, elle sera affichée sur la “tuile” du dispositif et visible dans les pages de recherche : décrivez au mieux votre programme.</p>
        <Input type="textarea" placeholder="Résumé" rows={5} value={props.abstract} onChange={props.onChange} id="abstract" />
      </ModalBody>
      <ModalFooter>
        <span className={"decompte" + (props.abstract.length > 110 ? " text-danger":"")}>{110 - props.abstract.length} sur 110 caractères restants</span>
        <Button onClick={validateAndClose} className="btn-go">
          <Icon name="checkmark-circle-2-outline" fill="#3D3D3D" size="large" />
          Envoyer
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default dispositifValidateModal;