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
        Un dernier effort
      </ModalHeader>
      <ModalBody>
        <p>Merci d’ajouter <b>une phrase explicative</b> décrivant votre fiche.{' '}<br/>Elle sera affichée dans les résultats de recherche.</p>
        <Input type="textarea" placeholder="Résumé" rows={5} value={props.abstract} onChange={props.onChange} id="abstract" placeholder="Résumez votre dispositif en une phrase" />
      </ModalBody>
      <ModalFooter>
        <span className={"decompte" + (props.abstract.length > 110 ? " text-danger":"")}>{110 - props.abstract.length} sur 110 caractères restants</span>
        <FButton name="checkmark" type="validate" onClick={validateAndClose} disabled={!props.abstract || props.abstract === "" || props.abstract.length > 110}>
          Envoyer
        </FButton>
      </ModalFooter>
    </Modal>
  )
}

export default dispositifValidateModal;