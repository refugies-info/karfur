import React from "react";
import { Col } from "reactstrap";
import FButton from "components/FigmaUI/FButton/FButton";
import { Props } from "./BackButton.container";
import styles from "./BackButton.module.scss";

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
      className={styles.top_left}
      onClick={props.goBack}
    >
      <FButton type="light-action" name="arrow-back" className={styles.btn}>
        <span>{props.t("Retour", "Retour")}</span>
      </FButton>
    </Col>
  );
};
