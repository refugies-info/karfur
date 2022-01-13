import React from "react";
// import { NavLink } from "react-router-dom";
import FButton from "../../../components/FigmaUI/FButton/FButton";

interface Props {
  goBack: any
  step: number
  t: any
}
export const GoBackButton = (props: Props) => {
  if (props.step === 0) {
    return (
      <NavLink to="/">
        <FButton
          type="light-action"
          name="arrow-back-outline"
          className="mr-10"
        >
          {props.t("Retour", "Retour")}
        </FButton>
      </NavLink>
    );
  }

  return (
    <FButton
      type="light-action"
      name="arrow-back-outline"
      className="mr-10"
      onClick={props.goBack}
    >
      {props.t("Retour", "Retour")}
    </FButton>
  );
};
