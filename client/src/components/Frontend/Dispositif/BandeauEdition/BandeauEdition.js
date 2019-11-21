import React from 'react';
import { NavLink } from 'react-router-dom';

import FButton from '../../../FigmaUI/FButton/FButton';
import {etapes} from './data';
import FSwitch from '../../../FigmaUI/FSwitch/FSwitch';

import './BandeauEdition.scss';
import variables from 'scss/colors.scss';

const bandeauEdition = (props) => {
  //Il faut virer tous les paragraphes de la section "C'est pour qui"
  const nbSections = props.uiArray.filter((x, i) => i!==1 && props.menu[i] && props.menu[i].content && props.menu[i].content!=="null").length + 
    props.uiArray.filter((x, i) => i!==1).reduce((acc, curr) => acc += curr.children && curr.children.length > 0 ? curr.children.length : 0, 0); 
  const nbSelected = (props.uiArray.filter(x => x.varianteSelected) || []).length +
    props.uiArray.reduce((acc, curr) => acc += curr.children && curr.children.length > 0 ? (curr.children.filter(y => y.varianteSelected) || []).length : 0, 0);
  const step = props.disableEdit ? 0 : 1;
  if(props.checkingVariante){
    return(
      <div className="bandeau-edition">
        <div className="dashed-panel no-radius" />
        <div className="bandeau">
          <div className="etapes">
            <h5>
              Est-ce que cette démarche est celle que vous recherchez ?
            </h5>
          </div>
          <div className="bandeau-btns">
            <b className="mr-10">Pas tout à fait :</b>
            <FButton type="validate" name="checkmark" onClick={props.toggleInVariante} className="mr-10">
              Créer une variante
            </FButton>
            <b className="mr-10">Pas du tout :</b>
            <FButton tag={NavLink} to="/comment-contribuer" type="light-action" name="arrow-back-outline" className="mr-10">
              Retour
            </FButton>
            <FButton type="dark" onClick={props.toggleCheckingVariante} className="mr-10">
              Oui !
            </FButton>
          </div>
        </div>
      </div>
    );
  }else{
    return(
      <div className="bandeau-edition">
        <div className="dashed-panel no-radius" />
        <div className="bandeau">
          <div className="etapes">
            <h5>
              Étape {step+1} sur 2 - {etapes[step].titre}{' : '}
              {step===0 && 
                <span className="color-focus">{nbSelected} sur {nbSections} paragraphes</span>}
            </h5>
          </div>
          <div className="bandeau-btns">
            {step === 1 && 
              <FSwitch content="Consignes" checked={props.withHelp} onClick={props.toggleHelp} className="mr-10" />}
            {step === 0 ?
              <FButton tag={NavLink} to="/comment-contribuer" type="outline-black" name="close-outline" className="mr-10">
                Quitter
              </FButton> :
              <FButton type="light-action" name="arrow-back-outline" className="mr-10" onClick={()=>props.editDispositif(null, true)}>
                Retour
              </FButton>}
            <FButton type="help" name="question-mark-circle" fill={variables.error} onClick={props.upcoming} className="mr-10">
              J'ai besoin d'aide
            </FButton>
            {step === 0 ?
              <FButton type="validate" name="checkmark" disabled={nbSelected===0} onClick={props.editDispositif}>
                Suivant
              </FButton> :
              <FButton type="validate" name="file-add-outline" onClick={()=>props.valider_dispositif()}>
                Publier
              </FButton>}
          </div>
        </div>
      </div>
    );
  }
}

export default bandeauEdition;