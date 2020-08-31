import React from "react";
import styled from "styled-components";
import { jsUcfirst } from "../../../../lib";
import FButton from "../../../FigmaUI/FButton/FButton";

interface Props {
  visible: boolean;
  typeContenu: string;
  toggleTutoriel: () => void;
  displayTuto: boolean;
  toggleDispositifValidateModal: () => void;
  toggleDraftModal: () => void;
  tKeyValue: number;
  toggleDispositifCreateModal: () => void;
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
  background: ${(props) => (props.yellow ? "#f9ef99" : "#edebeb")};
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
`;

const YellowText = styled.div`
  background: #f9ef99;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  padding: 8px;
  margin-left: 8px;
  margin-right: 15px;
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

const DescriptionText = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin-left: 15px;
`;

const EndDescription = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const KnowMore = styled.div`
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
`;

const getInfoText = (step: number, displayTuto: boolean) => {
  const initialText = {
    title: "Pour démarrer, cliquez sur les zones surlignées en",
    subtitle: "",
  };

  if (step === -1 || !displayTuto) return initialText;
  if (step === -4)
    return {
      title: "Titre informatif",
      subtitle:
        "Rédigez une courte phrase qui décrit l'action principale de votre dispositif.",
    };
  if (step === 1)
    return {
      title: "Critères d'accès",
      subtitle:
        "Configurez les critères et conditions d'accès à votre dispositif.",
    };
  if (step === -3)
    return {
      title: "Nom du dispositif",
      subtitle: "Comment s'appelle votre dispositif ?",
    };

  if (step === 3)
    return {
      title: "Inscription et engagement",
      subtitle: "Décrivez chaque étape pour rejoindre votre dispositif.",
    };

  if (step === -2)
    return {
      title: "Site internet",
      subtitle: "Ajoutez un lien vers votre site ou une page web utile.",
    };
  if (step === 2)
    return {
      title: "Détails et arguments",
      subtitle:
        "Rédigez plusieurs arguments pour valoriser l'intérêt de votre dispositif.",
    };
  if (step === -5)
    return {
      title: "Points de contact",
      subtitle: "Précisez les modalités d'accueil d'un ou plusieurs lieux.",
    };

  if (step === 0)
    return {
      title: "Résumé",
      subtitle: "Expliquez votre dispositif en deux paragraphes synthétiques.",
    };

  return initialText;
};
export const BandeauEditionWithoutVariante = (props: Props) => {
  const { title, subtitle } = getInfoText(props.tKeyValue, props.displayTuto);
  return (
    <div className={"bandeau-edition" + (props.visible ? "" : " go-to-top")}>
      <div className="dashed-panel no-radius" />
      <MainContainer visible={props.visible} yellow={props.displayTuto && props.tKeyValue !== -1}>
        <FirstGroupContainer>
          <ContentTypeContainer>
            {jsUcfirst(props.typeContenu)}
          </ContentTypeContainer>
          <InfoText>{title}</InfoText>
          {props.tKeyValue !== -1 && props.displayTuto && (
            <DescriptionText>{subtitle}</DescriptionText>
          )}
          {(props.tKeyValue === -1 || !props.displayTuto) && (
            <EndDescription>
              <YellowText>jaune.</YellowText>
              <KnowMore onClick={props.toggleDispositifCreateModal}>
                <u>En savoir plus</u>
              </KnowMore>
            </EndDescription>
          )}
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
};
