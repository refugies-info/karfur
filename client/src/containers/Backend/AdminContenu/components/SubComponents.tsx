import React from "react";
import styled from "styled-components";
import { ObjectId } from "mongodb";
import { limitNbCaracters } from "../../../../lib";
import { correspondingStatus } from "../data";
import EVAIcon from "../../../../components/UI/EVAIcon/EVAIcon";
// @ts-ignore
import variables from "scss/colors.scss";

const Container = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: ${(props) =>
    props.isDarkBackground ? variables.blancSimple : "#212121"};
  background-color: ${(props) =>
    props.isDarkBackground ? "#212121" : variables.blancSimple};
  padding: 8px;
  border-radius: 6px;
  width: fit-content;
  cursor: pointer;
`;

export const TypeContenu = (props: {
  type: string;
  isDetailedVue: boolean;
}) => {
  const correctedType = props.type === "dispositif" ? "Dispositif" : "Démarche";
  const isDarkBackground = props.type === "dispositif" || props.isDetailedVue;
  return (
    <Container isDarkBackground={isDarkBackground}>{correctedType}</Container>
  );
};

const maxDescriptionLength = 30;
const maxTitreMarqueLength = 25;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-style: normal;
  font-size: 16px;
  line-height: 20px;
  width: 270px;
  cursor: pointer;
`;

export const Title = (props: {
  titreInformatif: string;
  titreMarque: string | null;
}) => {
  const { titreInformatif, titreMarque } = props;
  const reducedTitreInfo = titreInformatif
    ? limitNbCaracters(titreInformatif, maxDescriptionLength)
    : "";
  const reducedTitreMarque = titreMarque
    ? limitNbCaracters(titreMarque, maxTitreMarqueLength)
    : "";

  return (
    <TitleContainer>
      <b>{reducedTitreInfo}</b>
      {reducedTitreMarque && <span>{`avec ${reducedTitreMarque}`}</span>}
    </TitleContainer>
  );
};

const StructureContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const getStructureNameAndStatus = (
  sponsor: SimplifiedStructure | null
): { structureName: string; statusColor: string } => {
  const red = "#F44336";
  const orange = "#FF9800";
  const green = "#4CAF50";

  if (!sponsor || !sponsor.nom)
    return { structureName: "Sans structure", statusColor: red };

  // @ts-ignore
  if (sponsor._id === "5e5fdb7b361338004e16e75f")
    return { structureName: "Structure temporaire", statusColor: red };

  const structureName = limitNbCaracters(sponsor.nom, maxDescriptionLength);
  const statusColor =
    sponsor.status === "Actif"
      ? green
      : sponsor.status === "En attente"
      ? orange
      : red;
  return { structureName, statusColor };
};

const ColoredRound = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 10px;
`;
interface SimplifiedStructure {
  _id: ObjectId;
  status: string;
  nom: string;
}
export const Structure = (props: { sponsor: SimplifiedStructure | null }) => {
  const { sponsor } = props;
  const { structureName, statusColor } = getStructureNameAndStatus(sponsor);
  return (
    <StructureContainer>
      <ColoredRound color={statusColor} />
      {structureName}
    </StructureContainer>
  );
};

export const StyledStatusContainer = styled.div`
  font-weight: bold;
  border-radius: 6px;
  padding: 8px;
  background-color: ${(props) => props.color};
  width: fit-content;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: #ffffff;
  cursor: pointer;
`;
const getColorAndStatus = (text: string) => {
  const correspondingStatusElement = correspondingStatus.filter(
    (element) => element.storedStatus === text
  );
  if (correspondingStatusElement.length > 0)
    return {
      status: correspondingStatusElement[0].displayedStatus,
      color: correspondingStatusElement[0].color,
    };

  return { status: "Nouveau !", color: "#0421B1" };
};
export const StyledStatus = (props: {
  text: string;
  overrideColor?: boolean;
}) => {
  const { status, color } = getColorAndStatus(props.text);
  return (
    <StyledStatusContainer color={props.overrideColor ? "#828282" : color}>
      {status}
    </StyledStatusContainer>
  );
};

const ButtonContainer = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${variables.grisFonce};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right:4px;
  margin-left:4px


  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? variables.grisFonce : props.hoverColor};
  }
`;
export const ValidateButton = (props: {
  onClick: () => void;
  disabled: boolean;
}) => (
  <ButtonContainer
    onClick={props.onClick}
    disabled={props.disabled}
    hoverColor={variables.validationHover}
  >
    <div style={{ marginBottom: "4px" }}>
      <EVAIcon
        name="checkmark-outline"
        fill={variables.blancSimple}
        size="20"
      />
    </div>
  </ButtonContainer>
);

export const SeeButton = (props: { burl: string }) => (
  <ButtonContainer hoverColor={variables.darkColor}>
    <a href={props.burl} target="_blank" rel="noopener noreferrer">
      <div style={{ marginBottom: "4px" }}>
        <EVAIcon name="eye-outline" fill={variables.blancSimple} size="20" />
      </div>
    </a>
  </ButtonContainer>
);

export const DeleteButton = (props: { onClick: () => void }) => (
  <ButtonContainer onClick={props.onClick} hoverColor={variables.error}>
    <div style={{ marginBottom: "4px" }}>
      <EVAIcon name="trash-outline" fill={variables.blancSimple} size="20" />
    </div>
  </ButtonContainer>
);

const FilterButtonContainer = styled.div`
  background: ${(props) =>
    props.isSelected ? variables.darkColor : variables.blancSimple};
  color: ${(props) =>
    props.isSelected ? variables.blancSimple : variables.darkColor};
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
export const FilterButton = (props: {
  onClick: () => void;
  text: string;
  isSelected: boolean;
}) => (
  <FilterButtonContainer
    onClick={props.onClick}
    isSelected={props.isSelected}
    key={props.text}
  >
    {props.text}
  </FilterButtonContainer>
);

const StyledTabHeader = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: ${(props) => (props.isSortedHeader ? "bold" : "normal")};
  cursor: ${(props) => props.order && "pointer"};
`;

export const TabHeader = (props: {
  name: string;
  order: string | null;
  isSortedHeader: boolean;
  sens: string;
}) => (
  <StyledTabHeader isSortedHeader={props.isSortedHeader} order={props.order}>
    {props.name}
    {props.order && (
      <EVAIcon name={`chevron-${props.sens}`} fill={variables.noir} />
    )}
  </StyledTabHeader>
);
