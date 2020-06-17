import React from "react";
import { Col } from "reactstrap";
import FButton from "../../../FigmaUI/FButton/FButton";
import { Props } from "./BackButton.container";

export interface PropsBeforeInjection {
  goBack: () => void;
  t: any;
}

export const BackButton: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <Col
      xl="6"
      lg="6"
      md="6"
      sm="6"
      xs="12"
      className="top-left"
      onClick={props.goBack}
    >
      <FButton type="light-action" name="arrow-back" className="btn-retour">
        <span>{props.t("Retour à la recherche", "Retour à la recherche")}</span>
      </FButton>
    </Col>
  );
};
