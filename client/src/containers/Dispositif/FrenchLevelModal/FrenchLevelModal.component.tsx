import React from "react";
import { Modal } from "reactstrap";
import "./FrenchLevelModal.scss";
// @ts-ignore
import styled from "styled-components";
// @ts-ignore
import Icon from "react-eva-icons";
import { FrenchLevelButton } from "./FrenchLevelButton/FrenchLevelButton";
import FButton from "../../../components/FigmaUI/FButton/FButton";

export interface PropsBeforeInjection {
  show: boolean;
  disableEdit: boolean;
  hideModal: () => void;
}

const StyledMainTitle = styled.p`
  font-weight: bold;
  font-size: 40px;
  line-height: 51px;
`;

const IconContainer = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  right: 20px;
  top: 20px;
`;

const MainContainer = styled.div`
  margin: 40px;
`;

const StyledTitle = styled.p`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin: 0;
  margin-bottom: 6px;
  color: ${(state: any) => (state.isSelected ? "#4CAF50" : "black")};
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  align-items: center;
  justify-content: flex-start;
`;

const StyledDescription = styled.p`
  font-size: 12px;
  line-height: 15px;
`;

const StyledButton = styled.div`
  width: 146px;
  height: 50px;
  background-color: black;
`;

const StyledDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const FrenchLevelButtonContainer = styled.div`
  margin-right: 20px;
`;
const StyledButtonContainer = styled.div`
  flex: 1;
  margin-left: 20px;
`;
const ButtonText = styled.p`
  font-size: 16px;
  line-height: 20px;
  margin: 0;
`;

const StyledButtonGroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledRightButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

const data = [
  {
    level: "A1",
    title: "Je découvre le français",
    description: `Je peux comprendre et utiliser des expressions familières et
quotidiennes avec des phrases très simples pour satisfaire des
besoins concrets.`,
    linkToKnowMore:
      "https://www.france-terre-asile.org/images/stories/publications/Diel%20kits/Kit_%C3%A9valuation_linguistique/Fiche_m%C3%A9mo_niveau_A1.pdf",
  },

  {
    level: "A2",
    title: "Je comprends des messages simples",
    description:
      "Je peux comprendre des phrases isolées et des expressions en relation avec mon environnement immédiat : famille, travail, école. Je peux parler de sujets familiers.",
    linkToKnowMore:
      "https://www.france-terre-asile.org/images/stories/publications/Diel%20kits/Kit_%C3%A9valuation_linguistique/Fiche_m%C3%A9mo_niveau_A2.pdf",
  },
  {
    level: "B1",
    title: "Je peux communiquer dans un environnement francophone",
    description:
      "Je peux comprendre les points essentiels d’un message quand un langage clair et standard est utilisé. Je peux communiquer dans la plupart des situations rencontrées en voyage. Je peux raconter un événement, une expérience.",
    linkToKnowMore:
      "https://www.france-terre-asile.org/images/stories/publications/Diel%20kits/Kit_%C3%A9valuation_linguistique/Fiche_m%C3%A9mo_niveau_B1.pdf",
  },
  {
    level: "B2",
    title: "Je communique avec aisance",
    description:
      "Je peux comprendre le contenu essentiel de messages complexes sur des sujets concrets ou abstraits. Je communique avec aisance avec un locuteur natif et je m'exprime de façon claire et détaillée sur une grande gamme de sujets.",
    linkToKnowMore:
      "https://www.france-terre-asile.org/images/stories/publications/Diel%20kits/Kit_%C3%A9valuation_linguistique/Fiche_m%C3%A9mo_niveau_B2.pdf",
  },
  {
    level: "C1",
    title: "Je communique avec grande aisance",
    description: "Pratiquement aucune difficulté particulière.",
    linkToKnowMore:
      "https://www.france-terre-asile.org/images/stories/publications/pdf/Guide_de_l___valuation_linguistique.pdf",
  },
];
interface StateType {
  isSelected: boolean;
}

export const FrenchLevelModalComponent = (props: PropsBeforeInjection) => {
  const state: StateType = {
    isSelected: false,
  };

  return (
    <Modal isOpen={props.show} className="modal-french-level" size="lg">
      {" "}
      <IconContainer onClick={props.hideModal}>
        <Icon name="close-outline" fill="#3D3D3D" size="large" />
      </IconContainer>
      <MainContainer>
        <StyledMainTitle>Niveau de langue souhaité</StyledMainTitle>
        {data.map((element, key) => (
          <SectionContainer key={key}>
            <FrenchLevelButtonContainer>
              <FrenchLevelButton
                isSelected={false}
                isHover={false}
                frenchLevel={element.level}
              />
            </FrenchLevelButtonContainer>
            <StyledDescriptionContainer>
              <StyledTitle {...state}>{element.title} </StyledTitle>
              <StyledDescription>
                {element.description}{" "}
                <a
                  style={{ textDecoration: "underline" }}
                  target="_blank"
                  href={element.linkToKnowMore}
                >
                  {"En savoir plus"}
                </a>
              </StyledDescription>
            </StyledDescriptionContainer>
            {props.disableEdit && (
              <StyledButtonContainer>
                <StyledButton />
              </StyledButtonContainer>
            )}
          </SectionContainer>
        ))}
        <StyledButtonGroupContainer>
          <FButton
            type="help"
            name="question-mark-circle"
            className="validate-button"
            href="https://help.refugies.info/fr/"
          >
            <ButtonText>J'ai besoin d'aide</ButtonText>
          </FButton>
          <StyledRightButtonGroup>
            <div
              style={{
                marginRight: 10,
              }}
            >
              <FButton type="outline-black" onClick={props.hideModal}>
                <ButtonText>Annuler</ButtonText>
              </FButton>
            </div>
            <FButton type="validate" name="checkmark">
              <ButtonText>Valider</ButtonText>
            </FButton>
          </StyledRightButtonGroup>
        </StyledButtonGroupContainer>
      </MainContainer>
    </Modal>
  );
};
