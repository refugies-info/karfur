import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import { Row, Col} from 'reactstrap';

import FButton from '../../../components/FigmaUI/FButton/FButton';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';
import UneVariante from './UneVariante/UneVariante';
import UserVariantes from './UserVariantes/UserVariantes';
import {customCriteres} from './data';

import './MoteurVariantes.scss';
import variables from 'scss/colors.scss';

class MoteurVariantes extends Component {
  state= {
    isReducedVue: false,
  }

  toggleVue = () => this.setState(pS => ({isReducedVue: !pS.isReducedVue}))

  render(){
    const {t, variantes} = this.props;
    const {isReducedVue} = this.state;
    const currVariante = variantes && variantes.length > 0 && variantes[0];
    if(this.props.disableEdit){
      return(
        <UserVariantes />
      )
    }else{
      return(
        <div className="moteur-variantes">
          <div className="dashed-panel" />

          <div className="moteur-wrapper">
            <div className="moteur-header">
              <h5>Tout d’abord : à qui s’adresse votre variante ?</h5>
              {isReducedVue && 
                <FButton type="dark" name="edit-outline" onClick={this.toggleVue}>
                  Modifier
                </FButton>}
            </div>

            {isReducedVue && variantes.length > 0 ?
              <Row>
                {currVariante.villes && currVariante.villes.length > 0 &&
                  <Col lg="auto" className="mr-10">
                    <div className="reduced-critere">
                      <div className="reduced-header">
                        <EVAIcon name="pin-outline" fill={variables.noir} className="mr-10" />
                        Localisation
                      </div>
                      <div className="reduced-body">
                        {currVariante.villes.length === 1 ? 
                          currVariante.villes[0].formatted_address : 
                          currVariante.villes.length + " villes"}
                      </div>
                    </div>
                  </Col>}
                {currVariante.ageTitle &&
                  <Col lg="auto" className="mr-10">
                    <div className="reduced-critere">
                      <div className="reduced-header">
                        <EVAIcon name="people-outline" fill={variables.noir} className="mr-10" />
                        Âge
                      </div>
                      <div className="reduced-body">
                        {(currVariante.ageTitle === 'De ** à ** ans') ? t("Dispositif.De", "De") + ' ' + currVariante.bottomValue + ' ' + t("Dispositif.à", "à") + ' ' + currVariante.topValue  + ' ' + t("Dispositif.ans", "ans") :
                          (currVariante.ageTitle === 'Moins de ** ans') ? t("Dispositif.Moins de", "Moins de") + ' ' + currVariante.topValue + ' ' + t("Dispositif.ans", "ans") :
                          t("Dispositif.Plus de", "Plus de") + ' ' + currVariante.bottomValue + ' ' + t("Dispositif.ans", "ans")}
                      </div>
                    </div>
                  </Col>}
                {customCriteres.map((critere, key)=> {
                  if(currVariante[critere.query]){
                    return (
                      <Col lg="auto" className="mr-10" key={key}>
                        <div className="reduced-critere">
                          <div className="reduced-header">
                            <EVAIcon name="options-2-outline" fill={variables.noir} className="mr-10" />
                            {critere.texte}
                          </div>
                          <div className="reduced-body">
                            {currVariante[critere.query].length === 1 ? 
                              currVariante[critere.query][0] : 
                              currVariante[critere.query].length + " critères"}
                          </div>
                        </div>
                      </Col>
                    )
                  }else{return false}
                })}
              </Row>:
              <UneVariante 
                variantes={this.props.variantes}
                validateVariante={this.props.validateVariante} 
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