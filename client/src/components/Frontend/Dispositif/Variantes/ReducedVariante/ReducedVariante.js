import React from "react";
import { withTranslation } from "react-i18next";

import { customCriteres } from "../../../../../containers/Dispositif/MoteurVariantes/data";
import EVAIcon from "../../../../UI/EVAIcon/EVAIcon";

import "./ReducedVariante.scss";
import {colors} from "colors";

const reducedVariante = (props) => {
  let { t, variantes, activeIdx, direction } = props;
  if (!activeIdx) {
    activeIdx = 0;
  }
  const currVariante =
    variantes && variantes.length > activeIdx && variantes[activeIdx];
  if (currVariante) {
    return (
      <div
        className={
          "reduced-variable direction-" +
          (direction === "column" ? "column" : "row")
        }
        onClick={(e) =>
          props.toggleCas ? props.toggleCas(e) : props.toggleVue(e)
        }
      >
        {direction !== "column" && (
          <div className="case-number">{activeIdx + 1}</div>
        )}
        {currVariante.villes && currVariante.villes.length > 0 && (
          <div className="variable-item">
            <div className="reduced-critere">
              <div className="reduced-header">
                <EVAIcon
                  name="pin-outline"
                  fill={colors.noir}
                  className="mr-10"
                />
                Localisation
              </div>
              <div className="reduced-body">
                {currVariante.villes.length === 1
                  ? currVariante.villes[0].formatted_address
                  : currVariante.villes.length + " villes"}
              </div>
            </div>
          </div>
        )}
        {currVariante.ageTitle && (
          <div className="variable-item">
            <div className="reduced-critere">
              <div className="reduced-header">
                <EVAIcon
                  name="people-outline"
                  fill={colors.noir}
                  className="mr-10"
                />
                Âge
              </div>
              <div className="reduced-body">
                {currVariante.ageTitle === "De ** à ** ans"
                  ? t("Dispositif.De", "De") +
                    " " +
                    currVariante.bottomValue +
                    " " +
                    t("Dispositif.à", "à") +
                    " " +
                    currVariante.topValue +
                    " " +
                    t("Dispositif.ans", "ans")
                  : currVariante.ageTitle === "Moins de ** ans"
                  ? t("Dispositif.Moins de", "Moins de") +
                    " " +
                    currVariante.topValue +
                    " " +
                    t("Dispositif.ans", "ans")
                  : t("Dispositif.Plus de", "Plus de") +
                    " " +
                    currVariante.bottomValue +
                    " " +
                    t("Dispositif.ans", "ans")}
              </div>
            </div>
          </div>
        )}
        {customCriteres.map((critere, key) => {
          if (currVariante[critere.query]) {
            return (
              <div className="variable-item" key={key}>
                <div className="reduced-critere">
                  <div className="reduced-header">
                    <EVAIcon
                      name="options-2-outline"
                      fill={colors.noir}
                      className="mr-10"
                    />
                    {critere.texte}
                  </div>
                  <div className="reduced-body">
                    {currVariante[critere.query].length === 1
                      ? currVariante[critere.query][0]
                      : currVariante[critere.query].length + " critères"}
                  </div>
                </div>
              </div>
            );
          } 
            return false;
          
        })}
      </div>
    );
  } 
    return (
      <div
        className={"plus-col" + (props.disabled ? " disabled" : "")}
        onClick={props.toggleCas}
      >
        <div className="add-wrapper">
          <div className="big-plus">+</div>
          <div className="add-texte">
            <b>Ajouter un autre cas</b>
          </div>
        </div>
      </div>
    );
  
};

export default withTranslation()(reducedVariante);
