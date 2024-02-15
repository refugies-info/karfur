import React from "react";
import styled from "styled-components";
import { limitNbCaracters } from "lib";
import { correspondingStatus, progressionData, publicationData } from "../AdminContenu/data";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import moment from "moment";
import styles from "../Admin.module.scss";
import { GetAllDispositifsResponse, Id } from "@refugies-info/api-types";
import { useUser } from "hooks";

const Container = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: ${(props: { isDarkBackground: boolean }) => (props.isDarkBackground ? colors.white : colors.gray90)};
  background-color: ${(props) => (props.isDarkBackground ? colors.gray90 : colors.white)};
  padding: 8px;
  border-radius: 6px;
  width: fit-content;
  cursor: pointer;
`;

export const TypeContenu = (props: { type: string; isDetailedVue: boolean }) => {
  const correctedType = props.type === "dispositif" ? "Dispositif" : "Démarche";
  const isDarkBackground = props.type === "dispositif" || props.isDetailedVue;
  return <Container isDarkBackground={isDarkBackground}>{correctedType}</Container>;
};

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  font-style: normal;
  font-size: 16px;
  line-height: 20px;
  max-width: 370px;
  flex: 1;
  cursor: pointer;
`;

export const Title = (props: { titreInformatif: string; titreMarque: string | null }) => {
  const { titreInformatif, titreMarque } = props;

  return (
    <TitleContainer>
      <b>{titreInformatif}</b>
      {titreMarque && <span>{`avec ${titreMarque}`}</span>}
    </TitleContainer>
  );
};

const StructureContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 300px;
`;

const getStructureNameAndStatus = (
  sponsor: GetAllDispositifsResponse["mainSponsor"] | null,
): { structureName: string; statusColor: string } => {
  const red = colors.error;
  const orange = colors.orange;
  const green = colors.validationHover;

  if (!sponsor || !sponsor.nom) return { structureName: "Sans structure", statusColor: red };

  const structureName = limitNbCaracters(sponsor.nom, 80);
  const statusColor = sponsor.status === "Actif" ? green : sponsor.status === "En attente" ? orange : red;
  return { structureName, statusColor };
};

export const ColoredRound = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 10px;
`;

const StructureName = styled.div`
  word-break: break-all;
  max-width: 280px;
`;

export const Structure = (props: { sponsor: GetAllDispositifsResponse["mainSponsor"] | null }) => {
  const { sponsor } = props;
  const { structureName, statusColor } = getStructureNameAndStatus(sponsor);
  return (
    <StructureContainer>
      <ColoredRound color={statusColor} />
      <StructureName>{structureName}</StructureName>
    </StructureContainer>
  );
};

interface StyledStatusContainer {
  disabled: boolean;
  textColor?: string;
  color: string;
}
export const StyledStatusContainer = styled.div`
  font-weight: bold;
  border-radius: 6px;
  padding: 8px;
  background-color: ${(props: StyledStatusContainer) => props.color};
  width: fit-content;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  white-space: nowrap;
  cursor: ${(props: StyledStatusContainer) => (props.disabled ? "not-allowed" : "pointer")};
  color: ${(props: StyledStatusContainer) => (props.textColor ? props.textColor : colors.white)};
`;
export const getColorAndStatus = (text: string, isAdmin?: boolean) => {
  const correspondingStatusElement = correspondingStatus.find((element) => element.storedStatus === text);
  if (correspondingStatusElement)
    return {
      status:
        isAdmin && correspondingStatusElement.adminStatus
          ? correspondingStatusElement.adminStatus
          : correspondingStatusElement.displayedStatus,
      color: correspondingStatusElement.color,
      textColor: correspondingStatusElement.textColor,
    };

  const correspondingStatusElementProgression = progressionData.find((element) => element.storedStatus === text);
  if (correspondingStatusElementProgression)
    return {
      status: correspondingStatusElementProgression.displayedStatus,
      color: correspondingStatusElementProgression.color,
      textColor: correspondingStatusElementProgression.textColor,
    };

  const correspondingStatusElementPublication = publicationData.find((element) => element.storedStatus === text);
  if (correspondingStatusElementPublication)
    return {
      status: correspondingStatusElementPublication.displayedStatus,
      color: correspondingStatusElementPublication.color,
      textColor: correspondingStatusElementPublication.textColor,
    };

  return {
    status: "Nouveau !",
    color: colors.bleuCharte,
    textColor: colors.white,
  };
};

export const StyledStatus = (props: {
  text: string;
  overrideColor?: boolean;
  textToDisplay?: string;
  color?: string;
  textColor?: string;
  disabled?: boolean;
}) => {
  const { user } = useUser();
  const colorsAndStatus = getColorAndStatus(props.text, user.admin);

  const color = props.overrideColor ? colors.gray70 : props.color ? props.color : colorsAndStatus.color;
  const status = props.textToDisplay ? props.textToDisplay : colorsAndStatus.status;
  const textColor = props.overrideColor ? colors.white : props.textColor ? props.textColor : colorsAndStatus.textColor;

  return (
    <StyledStatusContainer color={color} textColor={textColor} disabled={!!props.disabled}>
      {status}
    </StyledStatusContainer>
  );
};

interface ButtonContainerProps {
  disabled?: boolean;
  hoverColor?: string;
}
const ButtonContainer = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${colors.gray70};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4px;
  margin-left: 4px;
  cursor: ${(props: ButtonContainerProps) => (props.disabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${(props: ButtonContainerProps) => (props.disabled ? colors.gray70 : props.hoverColor)};
  }
`;
export const ValidateButton = (props: { onClick: () => void; disabled: boolean }) => (
  <ButtonContainer
    onClick={props.onClick}
    disabled={props.disabled}
    hoverColor={colors.validationHover}
    data-test-id="validate-button"
  >
    <div style={{ marginBottom: "4px" }}>
      <EVAIcon name="checkmark-outline" fill={colors.white} size={20} />
    </div>
  </ButtonContainer>
);

export const SeeButton = (props: { burl: string }) => (
  <ButtonContainer hoverColor={colors.gray90}>
    <a href={props.burl} target="_blank" rel="noopener noreferrer">
      <div style={{ marginBottom: "4px" }}>
        <EVAIcon name="eye" fill={colors.white} size={20} />
      </div>
    </a>
  </ButtonContainer>
);

export const EditButtonWithoutNavigation = (props: { onClick: () => void }) => (
  <ButtonContainer hoverColor={colors.gray90} onClick={props.onClick}>
    <div style={{ marginBottom: "4px" }}>
      <EVAIcon name="edit" fill={colors.white} size={20} />
    </div>
  </ButtonContainer>
);

export const DeleteButton = (props: { onClick: (event: any) => void; disabled: boolean }) => (
  <ButtonContainer
    onClick={props.disabled ? undefined : props.onClick}
    hoverColor={colors.error}
    disabled={props.disabled}
    data-test-id="delete-button"
  >
    <div style={{ marginBottom: "4px" }}>
      <EVAIcon name="trash" fill={colors.white} size={20} />
    </div>
  </ButtonContainer>
);

const FilterButtonContainer = styled.div`
  background: ${(props: { isSelected: boolean }) => (props.isSelected ? colors.gray90 : colors.white)};
  color: ${(props: { isSelected: boolean }) => (props.isSelected ? colors.white : colors.gray90)};
  border-radius: 12px;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
  padding: 15px;
  width: fit-content;
  margin-right: 8px;
  cursor: pointer;
  height: fit-content;
`;
export const FilterButton = (props: { onClick: () => void; text: string; isSelected: boolean }) => (
  <FilterButtonContainer onClick={props.onClick} isSelected={props.isSelected} key={props.text}>
    {props.text}
  </FilterButtonContainer>
);

const StyledTabHeader = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: bold;
  cursor: ${(props: { order: number }) => (props.order ? "pointer" : "inherit")};
`;

export const TabHeader = (props: {
  name: string;
  order: string | boolean | null;
  isSortedHeader: boolean;
  sens: string;
}) => (
  <StyledTabHeader order={props.order ? 1 : 0}>
    {props.name}
    {props.order && <EVAIcon name={`chevron-${props.sens}`} fill={colors.gray90} />}
  </StyledTabHeader>
);

export const Date = (props: { date: Date | undefined; author?: { _id: Id; username?: string; email: string } }) => (
  <p className={styles.text}>
    {!props.date ? (
      "Non disponible"
    ) : (
      <>
        {`${moment(props.date).format("LLL")} soit ${moment(props.date).fromNow()}`}
        {props.author && <strong>{` par ${props.author.username || props.author.email}`}</strong>}
      </>
    )}
  </p>
);

export const Label = (props: { children: any; htmlFor?: string }) => (
  <label className={styles.label} htmlFor={props.htmlFor}>
    {props.children}
  </label>
);
