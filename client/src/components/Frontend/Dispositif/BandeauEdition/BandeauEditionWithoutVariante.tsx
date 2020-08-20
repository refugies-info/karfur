import React from "react";
import styled from "styled-components";
import { jsUcfirst } from "../../../../lib";
import FButton from "../../../FigmaUI/FButton/FButton";

interface Props {
  typeContenu: string;
  toggleTutoriel: () => void;
  displayTuto: boolean;
  toggleDispositifValidateModal: () => void;
  toggleDraftModal: () => void;
}

const ContentTypeContainer = styled.div`
  background: #ffffff;
  border-radius: 6px;
  font-size: 12px;
  line-height: 15px;
  margin-left: 20px;
  height: 31px;
  padding: 8px;
`;

const MainContainer = styled.div`
  background: #edebeb;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: row;
  padding-top: 15px;
  padding-bottom: 15px;
  justify-content: space-between;
`;

const InfoText = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-left: 15px;
  margin-right: 8px;
`;

const YellowText = styled.div`
  background: #f9ef99;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  padding: 8px;
`;

const FirstGroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SecondGroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const BandeauEditionWithoutVariante = (props: Props) => (
  <div className="bandeau-edition">
    <div className="dashed-panel no-radius" />
    <MainContainer>
      <FirstGroupContainer>
        <ContentTypeContainer>
          {jsUcfirst(props.typeContenu)}
        </ContentTypeContainer>
        <InfoText>Pour démarrer, cliquez sur les zones surlignées en</InfoText>
        <YellowText>jaune.</YellowText>
      </FirstGroupContainer>
      <SecondGroupContainer>
        <FButton
          type="tuto"
          name={props.displayTuto ? "eye-off-outline" : "eye-outline"}
          className="mr-10"
          onClick={props.toggleTutoriel}
        >
          Tutoriel
        </FButton>
        <FButton
          type="light-action"
          name="save-outline"
          className="mr-10"
          onClick={props.toggleDraftModal}
        >
          Sauvegarder
        </FButton>
        <FButton
          className="mr-15"
          type="validate"
          name="checkmark-outline"
          onClick={props.toggleDispositifValidateModal}
        >
          Valider
        </FButton>
      </SecondGroupContainer>
    </MainContainer>
  </div>
);
