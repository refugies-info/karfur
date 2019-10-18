import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';

import FButton from '../../../components/FigmaUI/FButton/FButton';
import UneVariante from './UneVariante/UneVariante';
import UserVariantes from './UserVariantes/UserVariantes';
import ReducedVariante from '../../../components/Frontend/Dispositif/Variantes/ReducedVariante/ReducedVariante';

import './MoteurVariantes.scss';

class MoteurVariantes extends Component {
  state= {
    isReducedVue: false,
  }

  toggleVue = () => this.setState(pS => ({isReducedVue: !pS.isReducedVue}))

  render(){
    const {t, variantes, search, itemId} = this.props;
    const {isReducedVue} = this.state;
    if(this.props.disableEdit){
      return <UserVariantes switchVariante={this.props.switchVariante} search={search} />
    }else{
      return(
        <div className="moteur-variantes">
          <div className="dashed-panel" />

          <div className="moteur-wrapper">
            <div className="moteur-header">
              <h5>{itemId ? "Tout d’abord : à qui s’adresse votre variante ?" : "Créez vos cas ici : "}</h5>
              {isReducedVue && 
                <FButton type="dark" name="edit-outline" onClick={this.toggleVue}>
                  Modifier
                </FButton>}
            </div>

            {isReducedVue && variantes.length > 0 ?
              variantes.map((_, key) => (
                <ReducedVariante variantes={variantes} toggleVue={this.toggleVue} activeIdx={key} key={key} /> 
              ))
            :
              <UneVariante 
                variantes={this.props.variantes}
                validateVariante={this.props.validateVariante} 
                itemId={itemId}
                toggleVue={this.toggleVue}
                filtres={this.props.filtres} 
                upcoming={this.props.upcoming} />}

          </div>
        </div>
      )
    } 
  }
}

export default withTranslation()(MoteurVariantes);