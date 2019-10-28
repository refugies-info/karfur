import React, {Component} from 'react';

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
    const {variantes, search, inVariante, allDemarches} = this.props;
    const {isReducedVue} = this.state;
    if(this.props.disableEdit){
      return <UserVariantes switchVariante={this.props.switchVariante} allDemarches={allDemarches} variantes={variantes} search={search} />
    }else{
      return(
        <div className="moteur-variantes" id="moteur-variantes">
          <div className="dashed-panel" />

          <div className="moteur-wrapper">
            <div className="moteur-header">
              <h5>{inVariante ? "Tout d’abord : à qui s’adresse votre variante ?" : "Créez vos cas ici : "}</h5>
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
                inVariante={inVariante}
                toggleVue={this.toggleVue}
                filtres={this.props.filtres} 
                upcoming={this.props.upcoming} />}

          </div>
        </div>
      )
    } 
  }
}

export default MoteurVariantes;