import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Icon from 'react-eva-icons';

import './DispositifCreateModal.scss'

const dispositifCreateModal = (props) => {
  return(
    <Modal isOpen={props.show} toggle={props.toggle} className="dispositif-create-modal">
      <ModalHeader toggle={props.toggle}>
      Comment rédiger ?
      </ModalHeader>
      <ModalBody>
        <p>Vous allez commencer la rédaction d’une page dispositif, merci pour votre engagement. Cet exercice devrait vous prendre entre 20 et 40 minutes.</p>
        <h6>Gardez en tête le public de la plateforme</h6> 
        <p>Celle-ci s’adresse d’abord aux réfugiés et à leurs accompagnants. Il ne s’agit pas d’un support de communication institutionnelle mais d’une fiche pratique qui donne les principales informations de votre dispositifs. Le contenu doit être synthétique et vulgarisé. La lecture complète de la fiche ne devrait pas excéder deux minutes.</p> 
        <h6>Ne vous inquiètez pas, on repasse derrière</h6> 
        <p>Une fois la rédaction terminée, l’équipe Agi’r vérifiera le contenu (orthographe, exactitude des informations, conformité à la charte d’utilisation) puis publiera la page. Vous serez notifié.</p>
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.toggle} className="btn-go">
          <Icon name="checkmark-circle-2-outline" fill="#3D3D3D" size="large" />
          Ok, j’ai compris
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default dispositifCreateModal;