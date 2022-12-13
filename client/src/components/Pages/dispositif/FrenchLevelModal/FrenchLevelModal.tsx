import React, { useState } from "react";
import { Modal } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { FrenchLevelButton } from "./FrenchLevelButton/FrenchLevelButton";
import FButton from "components/UI/FButton/FButton";
import { frenchLevels } from "data/frenchLevel";
import styles from "./FrenchLevelModal.module.scss";
import { useTranslation } from "next-i18next";
interface Props {
  show: boolean;
  disableEdit: boolean;
  hideModal: () => void;
  selectedLevels: string[] | undefined;
  validateLevels: (arg: string[]) => void;
}

const FrenchLevelModal = (props: Props) => {
  const { t } = useTranslation();
  const [selectedLevels, setSelectedLevels] = useState<string[]>(props.selectedLevels || []);

  const updateSelectedLevels = (level: string) => {
    const selectedLevelsUpdated = selectedLevels.some((x) => x === level)
      ? selectedLevels.filter((x) => x !== level)
      : [...selectedLevels, level];

    setSelectedLevels(selectedLevelsUpdated)
  };

  const onValidate = () => {
    props.validateLevels(selectedLevels);
    props.hideModal();
  };

    return (
      <Modal
        isOpen={props.show}
        contentClassName={styles.modal}
        size="lg"
        toggle={props.hideModal}
      >
        {" "}
        <div
          onClick={props.hideModal}
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
            {t(
              "ModaleNiveauDeFrançais.Niveau de langue",
              "Niveau de langue"
            )}
          </p>
          {frenchLevels.map((element, key: number) => {
            const isSelected = selectedLevels
              ? selectedLevels.includes(element.level)
              : false;
            return (
              <div key={key} className={styles.section}>
                <div className={styles.btn_container}>
                  <FrenchLevelButton
                    isSelected={isSelected}
                    isHover={false}
                    frenchLevel={element.level}
                    onClick={updateSelectedLevels}
                    disableEdit={props.disableEdit}
                  />
                </div>
                <div className={styles.description}>
                  <p className={`${styles.subtitle} ${isSelected ? styles.selected : ""}`}>
                    {/* @ts-ignore */}
                    {t("ModaleNiveauDeFrançais." + element.title + " title",
                      element.title
                    )}
                  </p>
                  <p className={styles.description_text}>
                    {/* @ts-ignore */}
                    <>{t("ModaleNiveauDeFrançais." +
                        element.title +
                        " description",
                      element.description
                    )}{" "}</>
                    <a
                      style={{ textDecoration: "underline" }}
                      target="_blank"
                      href={element.linkToKnowMore}
                      rel="noopener noreferrer"
                    >
                      {t("En savoir plus", "En savoir plus")}
                    </a>
                  </p>
                </div>
                {props.disableEdit && element.linkToMakeTheTest && (
                  <div className={styles.test_btn_container}>
                    <FButton
                      type="dark"
                      name="external-link"
                      href={element.linkToMakeTheTest}
                      target="_blank"
                    >
                      <span className={styles.test_btn_text}>
                        {/* @ts-ignore */}
                        {t("ModaleNiveauDeFrançais.Faire le test",
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
            {t(
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
          {!props.disableEdit && (
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
                  <FButton type="outline-black" onClick={props.hideModal}>
                    <span className={styles.btn_text}>Annuler</span>
                  </FButton>
                </div>
                <FButton
                  type="validate"
                  name="checkmark"
                  onClick={onValidate}
                  disabled={selectedLevels.length === 0}
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

export default FrenchLevelModal;
