import React from "react";
import styled from "styled-components";
import { UserLanguage, TranslationStatus } from "types/interface";
import { colorAvancement } from "lib/colors";
import { Progress } from "reactstrap";
import { colors } from "colors";
import FSwitch from "components/FigmaUI/FSwitch/FSwitch";
import styles from "./SubComponents.module.scss";

interface Props {
  language: UserLanguage;
  isSelected: boolean;
  hasMultipleLanguages: boolean;
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 16px;
  align-items: center;
  cursor: ${(props: {hasMultipleLanguages: boolean}) => (props.hasMultipleLanguages ? "pointer" : "default")};
`;

interface TitleProps {
  hasMultipleLanguages: boolean
  isSelected: boolean
}
const Title = styled.div`
  font-weight: bold;
  font-size: ${(props: TitleProps) => (props.isSelected ? "28px" : "16px")};
  line-height: ${(props: TitleProps) => (props.isSelected ? "35px" : "20px")};
  text-decoration-line: ${(props: TitleProps) =>
    props.isSelected && props.hasMultipleLanguages ? "underline" : "none"};
`;
export const LanguageTitle = (props: Props) => (
  <MainContainer
    className={styles.language_title}
    hasMultipleLanguages={props.hasMultipleLanguages}
  >
    {props.isSelected ? (
      <i
        className={
          styles.selected + " flag-icon flag-icon-" + props.language.langueCode
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
      {props.language.langueFr === "Persan"
        ? "Persan/Dari"
        : props.language.langueFr}
    </Title>
  </MainContainer>
);

interface ProgressProps {
  avancementTrad: number;
  isExpert: boolean;
}

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100px;
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
      {!props.isExpert && (
        <div style={{ width: "100%" }}>
          <Progress color={color} value={props.avancementTrad * 100} />
        </div>
      )}
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
  background-color: ${(props: {backgroundColor: string}) => props.backgroundColor};
  border-radius: 8px;
  width: fit-content;
`;

const getStatus = (status: TranslationStatus, isSingular: boolean) => {
  if (status === "En attente")
    return { formattedStatus: "À valider", color: colors.orangeDark };
  if (status === "À revoir")
    return { formattedStatus: "À revoir", color: colors.redDark };
  if (status === "Validée")
    return {
      formattedStatus: isSingular ? "Publiée" : "Publiées",
      color: colors.green,
    };
  if (status === "À traduire")
    return { formattedStatus: "À traduire", color: colors.blue };
  return { formattedStatus: "No status", color: colors.erreur };
};

export const TradStatus = (props: TradStatusProps) => {
  const { formattedStatus, color } = getStatus(props.status, true);
  return (
    <TradStatusContainer backgroundColor={color}>
      {formattedStatus}
    </TradStatusContainer>
  );
};

interface FilterButtonContainerProps {
  isSelected: boolean
  color: string
}
const FilterButtonContainer = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${(props: FilterButtonContainerProps) => (props.isSelected ? colors.blancSimple : props.color)};
  padding: 17px;
  background-color: ${(props: FilterButtonContainerProps) =>
    props.isSelected ? props.color : colors.blancSimple};
  border-radius: 12px;
  width: fit-content;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface FilterButtonProps {
  status: TranslationStatus;
  isSelected: boolean;
  nbContent: number | string;
  onClick: () => void;
}
export const FilterButton = (props: FilterButtonProps) => {
  const { formattedStatus, color } = getStatus(props.status, false);
  return (
    <FilterButtonContainer
      color={color}
      isSelected={props.isSelected}
      onClick={props.onClick}
    >
      {formattedStatus + " (" + props.nbContent + ")"}
    </FilterButtonContainer>
  );
};

interface TypeContenuFilterButtonProps {
  isSelected: boolean;
  name: "Dispositifs" | "Démarches";
  onClick: () => void;
  nbContent: number | string;
}

const TypeContenuFilterButtonContainer = styled.div`
  padding: 15px;
  background-color: ${(props: {isSelected: boolean}) =>
    props.isSelected ? colors.noir : colors.blancSimple};
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${(props: {isSelected: boolean}) => (props.isSelected ? colors.blancSimple : colors.noir)};
  cursor: pointer;
  border-radius: 12px;
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const TypeContenuFilterButton = (
  props: TypeContenuFilterButtonProps
) => (
  <TypeContenuFilterButtonContainer
    isSelected={props.isSelected}
    onClick={props.onClick}
  >
    {props.name + " (" + props.nbContent + ")"}
    <FSwitch className="ml-8" checked={props.isSelected} />
  </TypeContenuFilterButtonContainer>
);
