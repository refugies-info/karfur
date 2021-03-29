import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "../../../../colors";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import { TraducteurModal } from "../../../../components/Modals";
import { UserState } from "../../../../services/User/user.reducer";

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
  user: UserState;
}
export const StartTranslating = (props: Props) => {
  const [showTraducteurModal, setShowTraducteurModal] = useState(false);
  const toggleTraducteurModal = () =>
    setShowTraducteurModal(!showTraducteurModal);
  return (
    <MainContainer>
      <Title>Vous n'avez pas traduit de fiches pour le moment.</Title>
      <WhiteContainer>
        <WhiteContainerTitle>
          Vous parlez une autre langue ?
        </WhiteContainerTitle>
        <WhiteContainerSubTitle>
          Vous parlez une autre langue ?
        </WhiteContainerSubTitle>
        <RowContainer>
          <FButton
            type="dark"
            className="mr-10"
            onClick={toggleTraducteurModal}
          >
            Commencer à traduire
          </FButton>
          <FButton type="tuto" className="ml-10">
            Explications
          </FButton>
        </RowContainer>
      </WhiteContainer>
      <TraducteurModal
        // @ts-ignore
        user={props.user}
        show={showTraducteurModal}
        setUser={() => {}}
        toggle={toggleTraducteurModal}
      />
    </MainContainer>
  );
};
