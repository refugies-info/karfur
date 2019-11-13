import React, {Component} from 'react';
import { ModalBody, ModalFooter } from 'reactstrap';

import EVAIcon from '../../UI/EVAIcon/EVAIcon';
import {interieur_2, interieur_3, interieur_4} from '../../../assets/figma';
import FButton from '../../FigmaUI/FButton/FButton';
import Modal from '../Modal';

import './DispositifCreateModal.scss';
import variables from 'scss/colors.scss';

class DispositifCreateModal extends Component {
  state={
    stepIdx: 0,
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.show !== this.props.show && this.state.stepIdx !== 0){
      this.setState({stepIdx: 0})
    }
  }

  changeStep = (next=true) => this.setState(pS => ({stepIdx: pS.stepIdx + (next ? 1 : -1)}))
  
  render(){
    const {toggle, startFirstJoyRide, onBoardSteps, typeContenu} = this.props;
    const {stepIdx} = this.state;
    return(
      <Modal 
        className="dispositif-create-modal" 
        modalHeader = {<>
          {stepIdx === 0 ? 
            (typeContenu === "demarche" ? "Ajoutez une démarche" : "C’est parti !") :
            onBoardSteps[stepIdx].title}
          {stepIdx === 0 &&
            <div className="temps-right">
              <EVAIcon className="mr-8" name="clock-outline" size="large" fill={variables.noir} />
              <span className="inline-custom">≈ {typeContenu === "demarche" ? 40 : 20} min</span>
            </div>} </>}
        {...this.props}
      >
        <ModalBody>
          {stepIdx === 0 ? <>
            <div className="content-bloc">
              <h5>1. Gardez en tête le public de la plateforme</h5> 
              <ul className="liste-classic">
                <li>Vous vous adressez à des personnes réfugiées : le vocabulaire employé doit être simple et accessible.</li> 
                <li>Il ne s’agit pas d’un support de communication institutionnelle mais d’une fiche pratique qui donne les principales informations de votre dispositifs. Le contenu doit être synthétique et vulgarisé.</li> 
                <li>La lecture complète de la fiche ne devrait pas excéder {typeContenu === "demarche" ? "trois" : "deux"} minutes.</li> 
              </ul>
            </div>
            <div className="content-bloc">
              <h5>2. Pas d’inquiétude, nous ne sommes pas loin !</h5>
              <ul className="liste-classic">
              <li>Une fois votre rédaction terminée, notre équipe (ou la structure responsable de votre fiche) sera notifiée pour procéder à d’éventuelles corrections ou vérifications. </li>
              <li>Après publication, vous pourrez accéder à la fiche depuis votre profil et vous recevrez des notifications lorsqu’un utilisateur vous remercie ou réagit sur certaines parties de votre fiche.</li>
              </ul> 
            </div></>:
            <div className="tuto-wrapper">
              <div className="image-figma">
                <img src={stepIdx === 1 ? interieur_2 : stepIdx === 2 ? interieur_3 : interieur_4} />
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