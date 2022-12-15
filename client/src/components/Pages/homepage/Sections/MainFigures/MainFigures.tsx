import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useTranslation } from "next-i18next";
import { cls } from "lib/classname";
import { CountUpFigure } from "components/Pages/staticPages/publier";
import commonStyles from "scss/components/staticPages.module.scss";

interface Props {
  nbVues: number;
  nbMercis: number;
  nbUpdatedRecently: number;
}

const MainFigures = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className={cls(commonStyles.section, commonStyles.bg_green)}>
      <Container className={cls(commonStyles.container, "text-center")}>
        <h2 className={cls(commonStyles.title2, "text-center text-white")}>{t("Homepage.figuresTitle")}</h2>
        <Row>
          <Col sm="12" lg="4">
            <CountUpFigure number={props.nbVues} text={t("Homepage.figuresSubtitle1")} />
          </Col>
          <Col sm="12" lg="4">
            <CountUpFigure number={props.nbMercis} text={t("Homepage.figuresSubtitle2")} />
          </Col>
          <Col sm="12" lg="4">
            <CountUpFigure number={props.nbUpdatedRecently} text={t("Homepage.figuresSubtitle3")} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainFigures;
