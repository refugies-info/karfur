import React, { Component } from "react";

import FButton from "../../../components/FigmaUI/FButton/FButton";
import UneVariante from "./UneVariante/UneVariante";
import ReducedVariante from "../../../components/Frontend/Dispositif/Variantes/ReducedVariante/ReducedVariante";

import "./MoteurVariantes.scss";

// MOTEUR DE CAS
class MoteurVariantes extends Component {
  state = {
    isReducedVue: false,
  };

  toggleVue = () => this.setState((pS) => ({ isReducedVue: !pS.isReducedVue }));
  render() {
    const { variantes } = this.props;

    // isReducedVue : boolean true when user has validated his case, false when user can modify his case
    const { isReducedVue } = this.state;

    // this part corresponds to the edition of a new case
    return (
      <div className="moteur-variantes" id="moteur-variantes">
        <div className="dashed-panel" />

        <div className="moteur-wrapper">
          <div className="moteur-header">
            <h5>{"Créez vos cas ici : "}</h5>
            {isReducedVue && (
              <FButton type="dark" name="edit-outline" onClick={this.toggleVue}>
                Modifier
              </FButton>
            )}
          </div>

          {isReducedVue && variantes.length > 0 ? (
            <div className="variantes-wrapper">
              {variantes.map((_, key) => (
                // summarized view of the cases of the variante
                <ReducedVariante
                  variantes={variantes}
                  toggleVue={this.toggleVue}
                  activeIdx={key}
                  key={key}
                />
              ))}
            </div>
          ) : (
            // permits to create new cases
            // not very clear what it makes
            <UneVariante
              variantes={this.props.variantes}
              validateVariante={this.props.validateVariante}
              deleteVariante={this.props.deleteVariante}
              toggleVue={this.toggleVue}
              filtres={this.props.filtres}
              upcoming={this.props.upcoming}
            />
          )}
        </div>
      </div>
    );
  }
}

export default MoteurVariantes;
