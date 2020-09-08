import React from "react";
import { NavLink } from "react-router-dom";
import FButton from "../../../FigmaUI/FButton/FButton";
import { etapes } from "./data";
import FSwitch from "../../../FigmaUI/FSwitch/FSwitch";
import "./BandeauEdition.scss";
// @ts-ignore
import variables from "scss/colors.scss";
import { Props } from "./BandeauEdition.container";
import { BandeauEditionWithoutVariante } from "./BandeauEditionWithoutVariante";

declare const window: any;

export interface PropsBeforeInjection {
  withHelp: boolean;
  disableEdit: boolean;
  checkingVariante: boolean;
  inVariante: boolean;
  editDispositif: (arg1: null, arg2: boolean) => void;
  upcoming: () => void;
  valider_dispositif: () => void;
  toggleHelp: () => void;
  toggleCheckingVariante: () => void;
  toggleInVariante: () => void;
  typeContenu: "dispositif" | "demarche";
  toggleTutoriel: () => void;
  displayTuto: boolean;
  toggleDispositifValidateModal: () => void;
  toggleDraftModal: () => void;
  tKeyValue: number;
  toggleDispositifCreateModal: () => void;
}
export class BandeauEdition extends React.Component<
  Props,
  { scroll: boolean; visible: boolean }
> {
  /**
   * explanations of props :
   * withHelp : activate or not help
   * disableEdit
   * checkingVariante, inVariante : on this page either checkingVariante or inVariante is true. if checkingVariante, ask if want to create a variante, if inVariante, select what to modify
   * editDispositif : callback to modify dispo
   * upcoming
   * valider_dispositif
   * toggleHelp
   * toggleCheckingVariante
   * toggleInVariante
   */
  constructor(props: any) {
    super(props);

    this.state = {
      //prevScrollpos: window.pageYOffset,
      visible: true,
      scroll: false,
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = currentScrollPos < 70;

    this.setState({
      visible,
    });
  };

  render() {
    const props = this.props;
    //Il faut virer tous les paragraphes de la section "C'est pour qui"
    const nbSections =
      props.uiArray.filter(
        (x, i) =>
          i !== 1 &&
          props.menu[i] &&
          props.menu[i].content &&
          props.menu[i].content !== "null"
      ).length +
      props.uiArray
        .filter((x, i) => i !== 1)
        .reduce(
          (acc, curr) =>
            (acc +=
              curr.children && curr.children.length > 0
                ? curr.children.length
                : 0),
          0
        );
    const nbSelected =
      (props.uiArray.filter((x) => x.varianteSelected) || []).length +
      props.uiArray.reduce(
        (acc, curr) =>
          (acc +=
            curr.children && curr.children.length > 0
              ? (curr.children.filter((y) => y.varianteSelected) || []).length
              : 0),
        0
      );
    const step = props.disableEdit ? 0 : 1;
    if (props.checkingVariante) {
      // yellow banner asking if user wants to create a new variante
      return (
        <div className="bandeau-edition">
          <div className="dashed-panel no-radius" />
          <div className="bandeau">
            <div className="etapes">
              <h5>Est-ce que cette démarche est celle que vous recherchez ?</h5>
            </div>
            <div className="bandeau-btns">
              <b className="mr-10">Pas tout à fait :</b>
              <FButton
                type="validate"
                name="checkmark"
                onClick={props.toggleInVariante}
                className="mr-10"
              >
                Créer une variante
              </FButton>
              <b className="mr-10">Pas du tout :</b>
              <FButton
                tag={NavLink}
                to="/comment-contribuer"
                type="light-action"
                name="arrow-back-outline"
                className="mr-10"
              >
                Retour
              </FButton>
              <FButton
                type="dark"
                onClick={props.toggleCheckingVariante}
                className="mr-10"
              >
                Oui !
              </FButton>
            </div>
          </div>
        </div>
      );
    }

    if (
      !props.checkingVariante &&
      !props.inVariante &&
      props.typeContenu === "dispositif"
    ) {
      return (
        <BandeauEditionWithoutVariante
          visible={this.state.visible}
          typeContenu={props.typeContenu}
          toggleTutoriel={props.toggleTutoriel}
          displayTuto={props.displayTuto}
          toggleDispositifValidateModal={props.toggleDispositifValidateModal}
          toggleDraftModal={props.toggleDraftModal}
          tKeyValue={props.tKeyValue}
          toggleDispositifCreateModal={props.toggleDispositifCreateModal}
        />
      );
    }

    // yellow banner when user is selecting which part of the demarche he wants to change
    return (
      <div className="bandeau-edition">
        <div className="dashed-panel no-radius" />
        <div className="bandeau">
          <div className="etapes">
            <h5>
              Étape {step + 1} sur 2 - {etapes[step].titre}
              {" : "}
              {step === 0 && (
                <span className="color-focus">
                  {nbSelected} sur {nbSections} paragraphes
                </span>
              )}
            </h5>
          </div>
          <div className="bandeau-btns">
            {step === 1 && (
              <FSwitch
                content="Consignes"
                checked={props.withHelp}
                onClick={props.toggleHelp}
                className="mr-10"
              />
            )}
            {step === 0 ? (
              <FButton
                tag={NavLink}
                to="/comment-contribuer"
                type="outline-black"
                name="close-outline"
                className="mr-10"
              >
                Quitter
              </FButton>
            ) : (
              <FButton
                type="light-action"
                name="arrow-back-outline"
                className="mr-10"
                onClick={() => props.editDispositif(null, true)}
              >
                Retour
              </FButton>
            )}
            <FButton
              type="help"
              name="question-mark-circle"
              fill={variables.error}
              onClick={props.upcoming}
              className="mr-10"
            >
              J'ai besoin d'aide
            </FButton>
            {step === 0 ? (
              <FButton
                type="validate"
                name="checkmark"
                disabled={nbSelected === 0}
                onClick={props.editDispositif}
              >
                Suivant
              </FButton>
            ) : (
              <FButton
                type="validate"
                name="file-add-outline"
                onClick={() => props.valider_dispositif()}
              >
                Publier
              </FButton>
            )}
          </div>
        </div>
      </div>
    );
  }
}
