import React from "react";
import styled from "styled-components";
import { ObjectId } from "mongodb";
import { limitNbCaracters } from "../../../../lib";
import { max } from "moment";

const Container = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: ${(props) => (props.isDispositif ? "#FFFFFF" : "#212121")};
  background-color: ${(props) => (props.isDispositif ? "#212121" : "#FFFFFF")};
  padding: 8px;
  border-radius: 6px;
  width: fit-content;
`;

export const TypeContenu = (props: { type: string }) => {
  const correctedType = props.type === "dispositif" ? "Dispositif" : "Démarche";
  return (
    <Container isDispositif={props.type === "dispositif"}>
      {correctedType}
    </Container>
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
`;

export const Title = (props: {
  titreInformatif: string;
  titreMarque: string;
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
      <span>{`avec ${reducedTitreMarque}`}</span>
    </TitleContainer>
  );
};

const StructureContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

interface SimplifiedStructure {
  _id: ObjectId;
  status: string;
  nom: string;
}
export const Structure = (props: { sponsor: SimplifiedStructure | null }) => {
  const { sponsor } = props;
  const structureName =
    sponsor && sponsor.nom
      ? limitNbCaracters(sponsor.nom, maxDescriptionLength)
      : "Pas de structure";
  const hasStructure = !!sponsor;
  const structureStatus =
    sponsor && sponsor.status ? sponsor.status : "noStructure";
  return <StructureContainer>{structureName}</StructureContainer>;
};
