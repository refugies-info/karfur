import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

import FButton from '../../FigmaUI/FButton/FButton';

import './DispositifValidateModal.scss';
import variables from 'scss/colors.scss';

const dispositifValidateModal = (props) => {
  const validateAndClose = () => {
    props.validate();
    props.toggle();
  }
  return(
    <Modal isOpen={props.show} toggle={props.toggle} className="dispositif-validate-modal">
      <ModalHeader toggle={props.toggle}>
        Un dernier effort !
      </ModalHeader>
      <ModalBody>
        <p>Merci d’ajouter une phrase explicative, elle sera affichée sur la “tuile” du dispositif et visible dans les pages de recherche : décrivez au mieux votre programme.</p>
        <Input type="textarea" placeholder="Résumé" rows={5} value={props.abstract} onChange={props.onChange} id="abstract" placeholder="Ceci est le résumé du dispositif" />
      </ModalBody>
      <ModalFooter>
        <span className={"decompte" + (props.abstract.length > 110 ? " text-danger":"")}>{110 - props.abstract.length} sur 110 caractères restants</span>
        <FButton name="checkmark-circle-2-outline" fill={variables.noir} onClick={validateAndClose} className="btn-go" disabled={!props.abstract || props.abstract === ""}>
          Envoyer
        </FButton>
      </ModalFooter>
    </Modal>
  )
}

export default dispositifValidateModal;