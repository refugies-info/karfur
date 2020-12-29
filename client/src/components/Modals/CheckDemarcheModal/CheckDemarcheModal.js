import React, { Component } from "react";
import { ModalBody, ModalFooter, FormGroup, Label, Input } from "reactstrap";
import { NavLink } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

import Modal from "../Modal";
import FButton from "../../FigmaUI/FButton/FButton";
import SearchBar from "../../../containers/UI/SearchBar/SearchBar";

import "./CheckDemarcheModal.scss";
import {colors} from "colors";

class CheckDemarcheModal extends Component {
  state = {
    step: 0,
    checked: false,
    selected: {},
  };

  componentDidMount() {
    if (this.state.step !== 0) {
      this.setState({ step: 0, checked: false });
    }
  }

  handleCheck = () => this.setState((pS) => ({ checked: !pS.checked }));
  setStep = (value = 0) => this.setState({ step: value });

  render() {
    const { t } = this.props;
    const { step, checked } = this.state;
    return (
      <Modal
        className="modal-check-demarche"
        modalHeader={
          step === 0
            ? t("CheckDemarche.Êtes-vous sûr", "Êtes-vous sûr ?")
            : t("CheckDemarche.Existe deja", "Est-ce qu’elle existe déjà ?")
        }
        {...this.props}
      >
        <ModalBody>
          {step === 0 ? (
            <>
              <p>
                {t(
                  "CheckDemarche.Vous allez créer",
                  "Vous allez créer une fiche démarche administrative"
                )}
                .{" "}
              </p>

              <p>
                {t(
                  "CheckDemarche.Ce type de fiche",
                  "Ce type de fiche concerne seulement les démarches proposées par l’État ou par une institution publique"
                )}
                .{" "}
              </p>

              <p>
                {t(
                  "CheckDemarche.Exemple",
                  "Exemple : la demande de logement social est une démarche administrative"
                )}
                . <br />
                {t(
                  "CheckDemarche.Le programme",
                  "Le programme de service civique Volont'R est un dispositif"
                )}
                .
              </p>

              <div className="blocs-choix">
                <NavLink to="/dispositif" className="bloc-choix">
                  <h5>{t("Non", "Non")}</h5>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t(
                        "CheckDemarche.Finalement",
                        "Finalement je préfère plutôt créer une fiche <b>dispositif</b>"
                      ),
                    }}
                  />
                </NavLink>
                <div
                  className="bloc-choix bloc-droit"
                  onClick={() => this.setStep(1)}
                >
                  <h5>{t("Oui", "Oui")}</h5>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t(
                        "CheckDemarche.je suis sur",
                        "Je suis sûr de vouloir créer une fiche <b>démarche administrative</b>"
                      ),
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <p>
                Ok ! Pour éviter les doublons, on va vérifier qu'elle n'existe
                pas déjà. Inscrivez le titre de votre démarche :
              </p>
              <SearchBar
                dispositifs
                loupe
                withEye
                toVariante
                className="search-bar inner-addon right-addon mt-10"
                placeholder="CMU-C, demande de logement social, solidarité transport"
                array={[
                  ...(this.props.dispositifs || []).filter(
                    (x) =>
                      x.status === "Actif" &&
                      x.typeContenu === "demarche" &&
                      !x.demarcheId
                  ),
                  { createNew: true, typeContenu: "demarche" },
                ]}
                createNewCta="Créer une nouvelle démarche"
              />
              <FormGroup
                check
                className={
                  "no-match cursor-pointer" + (checked ? " checked" : "")
                }
              >
                <Label check className="cursor-pointer">
                  <Input
                    type="checkbox"
                    checked={checked}
                    onChange={this.handleCheck}
                  />{" "}
                  <span>
                    Aucune fiche ne correspond à ma démarche administrative
                  </span>
                </Label>
              </FormGroup>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <div>
            <FButton
              type="light-action"
              name="arrow-back"
              fill={colors.noir}
              className="mr-10"
              onClick={() =>
                step === 1 ? this.setStep(0) : this.props.toggle()
              }
            >
              {t("Retour", "Retour")}
            </FButton>
            <FButton
              tag={"a"}
              href="https://help.refugies.info/fr/"
              target="_blank"
              rel="noopener noreferrer"
              type="help"
              name="question-mark-circle"
              fill={colors.error}
            >
              {t("J'ai besoin d'aide", "J'ai besoin d'aide")}
            </FButton>
          </div>
          {step > 0 && (
            <FButton
              tag={NavLink}
              to="/demarche"
              type="validate"
              name="file-add-outline"
              className={"right-button" + (checked ? "" : " disabled")}
            >
              Créer une démarche
            </FButton>
          )}
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dispositifs: state.activeDispositifs,
  };
};

export default connect(mapStateToProps)(withTranslation()(CheckDemarcheModal));
