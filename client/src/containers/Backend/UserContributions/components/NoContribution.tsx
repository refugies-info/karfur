import { ContribContainer } from "./SubComponents";
import React from "react";
import { NavHashLink } from "react-router-hash-link";
import styled from "styled-components";
import FButton from "../../../../components/UI/FButton/FButton";
import { colors } from "../../../../colors";
import Link from "next/link";

const Header = styled.div`
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  align-self: center;
  color: ${colors.gray90};
  margin-bottom: 40px;
`;

const WhiteContainer = styled.div`
  background: ${colors.white};
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
        <Link
          href="/comment-contribuer#ecrire"
          passHref
        >
          <FButton
            tag="a"
            type="dark"
            name="file-add-outline"
            className="mr-10"
          >
            Créer une nouvelle fiche
          </FButton>
        </Link>
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
