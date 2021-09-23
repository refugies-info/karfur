import React from "react";
import styled from "styled-components";
import FButton from "../../../FigmaUI/FButton/FButton";

interface Props {
  visible: boolean;
  typeContenu: "dispositif" | "demarche";
  toggleTutoriel: () => void;
  displayTuto: boolean;
  toggleDispositifValidateModal: () => void;
  toggleDraftModal: () => void;
  tKeyValue: number;
  toggleDispositifCreateModal: () => void;
  isModified: boolean;
  isSaved: boolean;
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

const getInfoText = (
  step: number,
  displayTuto: boolean,
  typeContenu: "dispositif" | "demarche"
) => {
  const initialText = {
    title: "Pour démarrer, cliquez sur les zones surlignées en",
    subtitle: "",
  };

  if (step === -1 || !displayTuto) return initialText;
  if (step === -6)
    return {
      title: "Choix des thèmes",
      subtitle: "Choisissez jusqu'à trois thèmes décrivant votre fiche.",
    };
  if (step === -7)
    return {
      title: "Partenaires",
      subtitle:
        "Indiquez la structure responsable de la fiche ainsi que d'éventuelles structures associées.",
    };
  if (typeContenu === "dispositif") {
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
        subtitle:
          "Expliquez votre dispositif en deux paragraphes synthétiques.",
      };
  }

  if (typeContenu === "demarche") {
    if (step === -4)
      return {
        title: "Titre de la démarche",
        subtitle: "Nommez votre fiche démarche avec les termes officiels.",
      };
    if (step === 0)
      return {
        title: "C'est quoi ?",
        subtitle:
          "Résumez la démarche en deux ou trois paragraphes synthétiques.",
      };

    if (step === 1)
      return {
        title: "C'est pour qui ?",
        subtitle:
          "Configurez les critères et conditions d'accès à la démarche.",
      };

    if (step === 2)
      return {
        title: "Comment faire ?",
        subtitle: "Expliquez chaque étape pour mener à bien la démarche.",
      };

    if (step === 3)
      return {
        title: "Et après ?",
        subtitle:
          "Abordez la fin ou le renouvellement du droit ou de la prestation obtenus.",
      };
  }

  return initialText;
};
export const BandeauEditionWithoutVariante = (props: Props) => {
  const { title, subtitle } = getInfoText(
    props.tKeyValue,
    props.displayTuto,
    props.typeContenu
  );
  const isDispositif = props.typeContenu === "dispositif";
  const correctContenu =
    props.typeContenu === "dispositif" ? "Dispositif" : "Démarche";
  return (
    <div className={"bandeau-edition" + (props.visible ? "" : " go-to-top")}>
      <div className="dashed-panel no-radius" />
      <MainContainer yellow={props.displayTuto && props.tKeyValue !== -1}>
        <FirstGroupContainer>
          <ContentTypeContainer>{correctContenu}</ContentTypeContainer>
          <InfoText>{title}</InfoText>
          {props.tKeyValue !== -1 && props.displayTuto && (
            <DescriptionText>{subtitle}</DescriptionText>
          )}
          {(props.tKeyValue === -1 || !props.displayTuto) && (
            <EndDescription>
              <YellowText>jaune.</YellowText>
              {isDispositif && (
                <KnowMore onClick={props.toggleDispositifCreateModal}>
                  <u>En savoir plus</u>
                </KnowMore>
              )}
            </EndDescription>
          )}
        </FirstGroupContainer>
        <SecondGroupContainer>
          {isDispositif && (
            <FButton
              type="tuto"
              name={props.displayTuto ? "eye-off-outline" : "eye-outline"}
              className="mr-10"
              onClick={props.toggleTutoriel}
            >
              Tutoriel
            </FButton>
          )}
          <FButton
            type={
              props.isModified
                ? "modified"
                : props.isSaved
                ? "saved"
                : "light-action"
            }
            name="save-outline"
            className="mr-10"
            onClick={props.toggleDraftModal}
          >
            {props.isSaved && !props.isModified
              ? "Sauvegardé !"
              : "Sauvegarder"}
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
