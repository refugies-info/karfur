import React from "react";
import styled from "styled-components";
import { Language, TranslationStatus } from "../../../../types/interface";
import "./SubComponents.scss";
import { colorAvancement } from "../../../../components/Functions/ColorFunctions";
import { Progress } from "reactstrap";
import { colors } from "../../../../colors";

interface Props {
  language: Language;
  isSelected: boolean;
  hasMultipleLanguages: boolean;
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 16px;
  margin-bottom: 20px;
  align-items: center;
  cursor: ${(props) => (props.hasMultipleLanguages ? "pointer" : "default")};
`;

const Title = styled.div`
  font-weight: bold;
  font-size: ${(props) => (props.isSelected ? "28px" : "16px")};
  line-height: ${(props) => (props.isSelected ? "35px" : "20px")};
  text-decoration-line: ${(props) =>
    props.isSelected && props.hasMultipleLanguages ? "underline" : "none"};
`;
export const LanguageTitle = (props: Props) => (
  <MainContainer
    className="language-title"
    hasMultipleLanguages={props.hasMultipleLanguages}
  >
    {props.isSelected ? (
      <i
        className={
          "flag-icon flag-icon-" + props.language.langueCode + " selected"
        }
        title={props.language.langueCode}
        id={props.language.langueCode}
      />
    ) : (
      <i
        className={"flag-icon flag-icon-" + props.language.langueCode}
        title={props.language.langueCode}
        id={props.language.langueCode}
      />
    )}
    <Title
      isSelected={props.isSelected}
      hasMultipleLanguages={props.hasMultipleLanguages}
    >
      {props.language.langueFr}
    </Title>
  </MainContainer>
);

interface ProgressProps {
  avancementTrad: number;
}

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 150px;
  align-items: center;
`;

const TextProgress = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  width: 100%;
  margin-left: 8px;
`;

const getAvancement = (avancementTrad: number) => {
  if (avancementTrad > 1) return 100;
  return Math.round((avancementTrad || 0) * 100);
};
export const ProgressWithValue = (props: ProgressProps) => {
  const color = colorAvancement(props.avancementTrad);
  return (
    <ProgressContainer>
      <div style={{ width: "100%" }}>
        <Progress color={color} value={props.avancementTrad * 100} />
      </div>
      <TextProgress>
        <div className={"text-" + color}>
          {getAvancement(props.avancementTrad)} %
        </div>
      </TextProgress>
    </ProgressContainer>
  );
};

interface TradStatusProps {
  status: TranslationStatus;
}

const TradStatusContainer = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  color: ${colors.blancSimple};
  padding: 8px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 8px;
  width: fit-content;
`;

const getStatus = (status: TranslationStatus) => {
  if (status === "En attente")
    return { formattedStatus: "À valider", color: colors.orangeDark };
  if (status === "À revoir")
    return { formattedStatus: "À revoir", color: colors.redDark };
  if (status === "Validée")
    return { formattedStatus: "Publiée", color: colors.green };
  if (status === "À traduire")
    return { formattedStatus: "À traduire", color: colors.blue };
  return { formattedStatus: "No status", color: colors.erreur };
};

export const TradStatus = (props: TradStatusProps) => {
  const { formattedStatus, color } = getStatus(props.status);
  return (
    <TradStatusContainer backgroundColor={color}>
      {formattedStatus}
    </TradStatusContainer>
  );
};
