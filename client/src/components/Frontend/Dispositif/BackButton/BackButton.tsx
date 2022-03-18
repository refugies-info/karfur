import React from "react";
import { Col } from "reactstrap";
import { useTranslation } from "next-i18next";
import FButton from "components/UI/FButton/FButton";
import styles from "./BackButton.module.scss";

interface Props {
  goBack: () => void;
}

const BackButton: React.FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
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
        <span>{t("Retour", "Retour")}</span>
      </FButton>
    </Col>
  );
};

export default BackButton;