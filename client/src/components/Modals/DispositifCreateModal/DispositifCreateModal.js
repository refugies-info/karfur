import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Button from "../../FigmaUI/FButton/FButton"
import EVAIcon from '../../UI/EVAIcon/EVAIcon';

import './DispositifCreateModal.scss'

const dispositifCreateModal = (props) => {
  return(
    <Modal isOpen={props.show} toggle={props.toggle} className="dispositif-create-modal">
      <ModalHeader toggle={props.toggle}>
        C’est parti !
        <div className="align-right">
          <EVAIcon className="mr-8" name="clock-outline" size="large" />
          <span>15-30 minutes</span>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="content-bloc">
          <h5>1. Gardez en tête le public de la plateforme</h5> 
          <ul className="liste-classic">
            <li>Vous vous adressez à des personnes réfugiées : le vocabulaire employé doit être simple et accessible.</li> 
            <li>Il ne s’agit pas d’un support de communication institutionnelle mais d’une fiche pratique qui donne les principales informations de votre dispositifs.</li> 
            <li>Le contenu doit être synthétique et vulgarisé.</li> 
            <li>La lecture complète de la fiche ne devrait pas excéder deux minutes.</li> 
          </ul>
        </div>
        <div className="content-bloc">
          <h5>2. Pas d’inquiétude, nous ne sommes pas loin !</h5>
          <ul className="liste-classic">
          <li>Une fois votre rédaction terminée, l’équipe Agi’r sera notifiée et vérifiera le contenu : orthographe, exactitude des informations, conformité à la charte d’utilisation... puis publiera la page. </li>
          <li>Vous recevrez alors une notification dans votre espace utilisateur. La fiche apparaîtra dans votre espace et vous serez notifier au fur et à mesure des réactions des utilisateurs. </li>
          </ul> 
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="align-left">
          <u className="cursor-pointer" onClick={props.upcoming}>J’ai besoin de plus d’explications</u>
        </div>
        <div className="align-right">
          <Button type="light" onClick={props.toggle} className="mr-10">
            Annuler
          </Button>
          <Button type="validate" onClick={props.startFirstJoyRide} name="checkmark-circle-2-outline">
            Ok, j’ai compris
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

export default dispositifCreateModal;