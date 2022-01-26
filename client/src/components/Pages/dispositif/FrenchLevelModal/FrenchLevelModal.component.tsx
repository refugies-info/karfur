import React, { Component } from "react";
import { Modal } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { FrenchLevelButton } from "./FrenchLevelButton/FrenchLevelButton";
import FButton from "components/FigmaUI/FButton/FButton";
import { Props } from "./FrenchLevelModal.container";
import { frenchLevels } from "data/frenchLevel";
import styles from "./FrenchLevelModal.module.scss";
export interface PropsBeforeInjection {
  show: boolean;
  disableEdit: boolean;
  hideModal: () => void;
  selectedLevels: string[] | undefined;
  validateLevels: (arg: string[]) => void;
  t: any;
}

interface StateType {
  selectedLevels: string[];
}

export class FrenchLevelModalComponent extends Component<Props> {
  state: StateType = {
    selectedLevels: this.props.selectedLevels || [],
  };

  updateSelectedLevels = (level: string) => {
    const selectedLevels = this.state.selectedLevels;
    const selectedLevelsUpdated = selectedLevels.some((x) => x === level)
      ? selectedLevels.filter((x) => x !== level)
      : [...selectedLevels, level];

    this.setState({
      selectedLevels: selectedLevelsUpdated,
    });
  };

  onValidate = () => {
    this.props.validateLevels(this.state.selectedLevels);
    this.props.hideModal();
  };

  render() {
    return (
      <Modal
        isOpen={this.props.show}
        contentClassName={styles.modal}
        size="lg"
        toggle={this.props.hideModal}
      >
        {" "}
        <div
          onClick={this.props.hideModal}
          className={styles.close}
        >
          <EVAIcon
            name="close-outline"
            fill="#3D3D3D"
            size="large"
          />
        </div>
        <div className={styles.container}>
          <p className={styles.title}>
            {this.props.t(
              "ModaleNiveauDeFrançais.Niveau de langue",
              "Niveau de langue"
            )}
          </p>
          {frenchLevels.map((element, key: number) => {
            const isSelected = this.state.selectedLevels
              ? this.state.selectedLevels.includes(element.level)
              : false;
            return (
              <div key={key} className={styles.section}>
                <div className={styles.btn_container}>
                  <FrenchLevelButton
                    isSelected={isSelected}
                    isHover={false}
                    frenchLevel={element.level}
                    onClick={this.updateSelectedLevels}
                    disableEdit={this.props.disableEdit}
                  />
                </div>
                <div className={styles.description}>
                  <p className={`${styles.subtitle} ${isSelected ? styles.selected : ""}`}>
                    {this.props.t(
                      "ModaleNiveauDeFrançais." + element.title + " title",
                      element.title
                    )}
                  </p>
                  <p className={styles.description_text}>
                    {this.props.t(
                      "ModaleNiveauDeFrançais." +
                        element.title +
                        " description",
                      element.description
                    )}{" "}
                    <a
                      style={{ textDecoration: "underline" }}
                      target="_blank"
                      href={element.linkToKnowMore}
                      rel="noopener noreferrer"
                    >
                      {this.props.t("En savoir plus", "En savoir plus")}
                    </a>
                  </p>
                </div>
                {this.props.disableEdit && element.linkToMakeTheTest && (
                  <div className={styles.test_btn_container}>
                    <FButton
                      type="dark"
                      name="external-link"
                      href={element.linkToMakeTheTest}
                      target="_blank"
                    >
                      <span className={styles.test_btn_text}>
                        {this.props.t(
                          "ModaleNiveauDeFrançais.Faire le test",
                          "Faire le test"
                        )}
                      </span>
                    </FButton>{" "}
                  </div>
                )}
              </div>
            );
          })}
          <div className={styles.level}>
            {this.props.t(
              "ModaleNiveauDeFrançais.Ces niveaux sont issus du",
              "Ces niveaux sont issus du"
            )}{" "}
            <a
              style={{ textDecoration: "underline" }}
              target="_blank"
              href={
                "https://www.coe.int/fr/web/common-european-framework-reference-languages"
              }
              rel="noopener noreferrer"
            >
              {"Cadre européen commun de référence pour les langues"}
            </a>{" "}
            (CECR).
          </div>
          {!this.props.disableEdit && (
            <div className={styles.group_btn_container}>
              <FButton
                type="help"
                name="question-mark-circle"
                className="validate-button"
                href="https://help.refugies.info/fr/"
                target="_blank"
              >
                <span className={styles.btn_text}>J&apos;ai besoin d&apos;aide</span>
              </FButton>
              <div className={styles.right}>
                <div
                  style={{
                    marginRight: 10,
                  }}
                >
                  <FButton type="outline-black" onClick={this.props.hideModal}>
                    <span className={styles.btn_text}>Annuler</span>
                  </FButton>
                </div>
                <FButton
                  type="validate"
                  name="checkmark"
                  onClick={this.onValidate}
                  disabled={this.state.selectedLevels.length === 0}
                >
                  <span className={styles.btn_text}>Valider</span>
                </FButton>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}
