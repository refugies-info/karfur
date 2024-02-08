import React from "react";
import styled from "styled-components";
import { colorAvancement } from "lib/colors";
import { Progress } from "reactstrap";
import { colors } from "colors";
import styles from "./SubComponents.module.scss";
import { GetLanguagesResponse, TraductionsStatus } from "@refugies-info/api-types";

interface Props {
  language: GetLanguagesResponse;
  isSelected: boolean;
  hasMultipleLanguages: boolean;
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 16px;
  align-items: center;
  cursor: ${(props: { hasMultipleLanguages: boolean }) => (props.hasMultipleLanguages ? "pointer" : "default")};
`;

interface TitleProps {
  hasMultipleLanguages: boolean;
  isSelected: boolean;
}
const Title = styled.div`
  font-weight: bold;
  font-size: ${(props: TitleProps) => (props.isSelected ? "28px" : "16px")};
  line-height: ${(props: TitleProps) => (props.isSelected ? "35px" : "20px")};
  text-decoration-line: ${(props: TitleProps) =>
    props.isSelected && props.hasMultipleLanguages ? "underline" : "none"};
`;
export const LanguageTitle = (props: Props) => (
  <MainContainer className={styles.language_title} hasMultipleLanguages={props.hasMultipleLanguages}>
    {props.isSelected ? (
      <span
        className={styles.selected + " fi fi-" + props.language.langueCode}
        title={props.language.langueCode}
        id={props.language.langueCode}
      />
    ) : (
      <span
        className={"fi fi-" + props.language.langueCode}
        title={props.language.langueCode}
        id={props.language.langueCode}
      />
    )}
    <Title isSelected={props.isSelected} hasMultipleLanguages={props.hasMultipleLanguages}>
      {props.language.langueFr === "Persan" ? "Persan/Dari" : props.language.langueFr}
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
  return Math.ceil((avancementTrad || 0) * 100);
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
        <div className={"text-" + color}>{getAvancement(props.avancementTrad)} %</div>
      </TextProgress>
    </ProgressContainer>
  );
};

interface TradStatusProps {
  status: TraductionsStatus;
}

const TradStatusContainer = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  color: ${colors.white};
  padding: 8px;
  background-color: ${(props: { backgroundColor: string }) => props.backgroundColor};
  border-radius: 8px;
  width: fit-content;
`;

const getStatus = (status: TraductionsStatus, isSingular: boolean) => {
  if (status === "PENDING") return "À valider";
  if (status === "TO_REVIEW") return "À revoir";
  if (status === "VALIDATED") return isSingular ? "Publiée" : "Publiées";
  if (status === "TO_TRANSLATE") return "À traduire";
  return "No status";
};
const getColor = (status: TraductionsStatus) => {
  if (status === "PENDING") return colors.orangeDark;
  if (status === "TO_REVIEW") return colors.redDark;
  if (status === "VALIDATED") return colors.green;
  if (status === "TO_TRANSLATE") return colors.blue;
  return colors.erreur;
};

export const TradStatus = (props: TradStatusProps) => {
  const formattedStatus = getStatus(props.status, true);
  const color = getColor(props.status);
  return <TradStatusContainer backgroundColor={color}>{formattedStatus}</TradStatusContainer>;
};

interface FilterButtonContainerProps {
  isSelected: boolean;
  color: string;
}
const FilterButtonContainer = styled.button`
  color: ${(props: FilterButtonContainerProps) => (props.isSelected ? colors.white : props.color)};
  background-color: ${(props: FilterButtonContainerProps) => (props.isSelected ? props.color : colors.white)};

  &:hover {
    background-color: ${(props: FilterButtonContainerProps) =>
      props.isSelected ? styles.lightTextMentionGrey : "inherit"} !important;
  }
`;

interface FilterButtonProps {
  status?: TraductionsStatus;
  name?: string;
  isSelected: boolean;
  nbContent: number | string;
  onClick: () => void;
}
export const FilterButton = (props: FilterButtonProps) => {
  const content = props.status ? getStatus(props.status, false) : props.name || "";
  const color = props.status ? getColor(props.status) : colors.gray90;
  return (
    <FilterButtonContainer
      className={styles.filter}
      color={color}
      isSelected={props.isSelected}
      onClick={props.onClick}
    >
      {content + " (" + props.nbContent + ")"}
    </FilterButtonContainer>
  );
};
