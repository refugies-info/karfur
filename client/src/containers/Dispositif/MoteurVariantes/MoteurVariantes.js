import React, { Component } from "react";

import FButton from "../../../components/FigmaUI/FButton/FButton";
import UneVariante from "./UneVariante/UneVariante";
import UserVariantes from "./UserVariantes/UserVariantes";
import ReducedVariante from "../../../components/Frontend/Dispositif/Variantes/ReducedVariante/ReducedVariante";

import "./MoteurVariantes.scss";

class MoteurVariantes extends Component {
  /**
   * explanations of props
   * disableEdit : is true when starting to create a variante (selection of paragraphs to modify)
   * inVariante : is true when writing the variante
   */
  state = {
    isReducedVue: false,
  };

  toggleVue = () => this.setState((pS) => ({ isReducedVue: !pS.isReducedVue }));

  render() {
    const { variantes, search, inVariante, allDemarches } = this.props;

    // isReducedVue : boolean true when user has validated his case, false when user can modify his case
    const { isReducedVue } = this.state;
    if (this.props.disableEdit) {
      // when disableEdit, user can see the demarch in lecture mode (and can chose the city for example)
      return (
        <UserVariantes
          switchVariante={this.props.switchVariante}
          allDemarches={allDemarches}
          variantes={variantes}
          search={search}
        />
      );
    }
    // this part corresponds to the edition of the new variante or the modification of a demarch that has a variante
    return (
      <div className="moteur-variantes" id="moteur-variantes">
        <div className="dashed-panel" />

        <div className="moteur-wrapper">
          <div className="moteur-header">
            <h5>
              {inVariante
                ? "À qui s’adresse votre variante ?"
                : "Créez vos cas ici : "}
            </h5>
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
              inVariante={inVariante}
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
