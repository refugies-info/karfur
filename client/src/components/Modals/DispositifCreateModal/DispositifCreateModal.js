import React, {Component} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import EVAIcon from '../../UI/EVAIcon/EVAIcon';
import {interieur_2, interieur_3, interieur_4} from '../../../assets/figma'

import './DispositifCreateModal.scss';
import variables from 'scss/colors.scss';
import FButton from '../../FigmaUI/FButton/FButton';

class DispositifCreateModal extends Component {
  state={
    stepIdx: 0,
  }

  changeStep = (next=true) => this.setState(pS => ({stepIdx: pS.stepIdx + (next ? 1 : -1)}))
  
  render(){
    const {show, toggle, startFirstJoyRide, onBoardSteps} = this.props;
    const {stepIdx} = this.state;
    return(
      <Modal isOpen={show} toggle={toggle} className="dispositif-create-modal">
        <ModalHeader toggle={toggle}>
          {onBoardSteps[stepIdx].title}
          {stepIdx === 0 &&
            <div className="align-right">
              <EVAIcon className="mr-8" name="clock-outline" size="large" fill={variables.noir} />
              <span>≈ 20 minutes</span>
            </div>}
        </ModalHeader>
        <ModalBody>
          {stepIdx === 0 ? <>
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
            </div></>:
            <div className="tuto-wrapper">
              <div className="image-figma">
                <img src={interieur_2} />
              </div>
              {onBoardSteps[stepIdx].content}
            </div>}
        </ModalBody>
        <ModalFooter>
          <div className="align-left">
            <ul className="nav nav-tabs" role="tablist">
              {onBoardSteps.map((_,idx) => (
                <li role="presentation" className={stepIdx === onBoardSteps.length - 1 ? "active ended" : idx <= stepIdx ? "active" : "disabled"} key={idx}>
                  <span className="round-tab" />
                </li>
              ))}
            </ul>
          </div>
          <div className="align-right">
            {stepIdx === 0 ?
              <FButton type="light-action" onClick={toggle} className="mr-10">
                Annuler
              </FButton>:
              <FButton type="light-action" name="arrow-back" fill={variables.noir} onClick={()=>this.changeStep(false)} className="mr-10" />}
            {stepIdx === onBoardSteps.length - 1 ?
              <FButton type="validate" name="checkmark" onClick={startFirstJoyRide}>
                Démarrer
              </FButton>:
              <FButton type="light-action" name="arrow-forward" fill={variables.noir} onClick={this.changeStep} />}
          </div>
        </ModalFooter>
      </Modal>
    )
  }
}

export default DispositifCreateModal;