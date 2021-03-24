import { ContribContainer } from "./SubComponents";
import React from "react";
import styled from "styled-components";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import { NavHashLink } from "react-router-hash-link";
import { colors } from "../../../../colors";

const Header = styled.div`
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  align-self: center;
  color: ${colors.noir};
  margin-bottom: 40px;
`;

const WhiteContainer = styled.div`
  background: ${colors.blancSimple};
  border-radius: 12px;
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  font-weight: normal;
  font-size: 32px;
  line-height: 40px;
  color: ${colors.darkGrey};
  margin-top: 52px;
  margin-bottom: 20px;
`;

const SubTitle = styled.div`
  font-weight: normal;
  font-size: 18px;
  line-height: 23px;
  color: ${colors.darkGrey};
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 40px;
`;

export const NoContribution = (props: {
  toggleTutoModal: () => void;
  setTutoModalDisplayed: (arg: string) => void;
}) => (
  <ContribContainer>
    <Header>Vous n'avez pas encore rédigé de fiche.</Header>
    <WhiteContainer>
      <Title>C'est parti ?</Title>
      <SubTitle>
        Chacun peut apporter sa contribution pour enrichir le site.
      </SubTitle>
      <SubTitle>Lancez-vous !</SubTitle>
      <RowContainer>
        <FButton
          tag={NavHashLink}
          to="/comment-contribuer#ecrire"
          type="dark"
          name="file-add-outline"
          className="mr-10"
        >
          Créer une nouvelle fiche
        </FButton>
        <FButton
          type="tuto"
          name="video-outline"
          className="ml-10"
          onClick={() => {
            props.setTutoModalDisplayed("Mes fiches");
            props.toggleTutoModal();
          }}
        >
          Explications
        </FButton>
      </RowContainer>
    </WhiteContainer>
  </ContribContainer>
);
