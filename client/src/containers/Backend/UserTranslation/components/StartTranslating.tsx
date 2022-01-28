import React from "react";
import styled from "styled-components";
import { colors } from "colors";
import FButton from "components/FigmaUI/FButton/FButton";
import traductionIconBlanc from "assets/icon_traduction_blanc.svg";
import styles from "containers/Backend/Navigation/components/NavButton.module.scss";

const Title = styled.div`
  font-weight: bold;
  font-size: 27.7097px;
  line-height: 35px;
  margin-bottom: 40px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  align-items: center;
  flex: 1;
`;

const WhiteContainer = styled.div`
  background: ${colors.blancSimple};
  border-radius: 12px;
  width: 1040px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const WhiteContainerTitle = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${colors.darkGrey};
  margin-top: 60px;
  margin-bottom: 20px;
`;

const WhiteContainerSubTitle = styled.div`
  font-size: 18px;
  line-height: 23px;
  color: ${colors.darkGrey};
  margin-bottom: 40px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 60px;
`;

interface Props {
  toggleTraducteurModal: () => void;
  toggleTutoModal: () => void;
}
export const StartTranslating = (props: Props) => {
  return (
    <MainContainer>
      <Title>Vous n'avez pas traduit de fiches pour le moment.</Title>
      <WhiteContainer>
        <WhiteContainerTitle>
          Vous parlez une autre langue ?
        </WhiteContainerTitle>
        <WhiteContainerSubTitle>
          Aidez à traduire les contenus à votre rythme.
        </WhiteContainerSubTitle>
        <RowContainer>
          <FButton
            type="dark"
            className="mr-10"
            onClick={props.toggleTraducteurModal}
          >
            <img
              src={traductionIconBlanc}
              alt="a"
              className={styles.icon_traduction}
            />
            Commencer à traduire
          </FButton>
          <FButton
            type="tuto"
            className="ml-10"
            name="video-outline"
            onClick={props.toggleTutoModal}
          >
            Explications
          </FButton>
        </RowContainer>
      </WhiteContainer>
    </MainContainer>
  );
};
