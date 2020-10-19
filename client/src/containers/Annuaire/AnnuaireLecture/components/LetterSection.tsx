import React from "react";
import styled from "styled-components";
import { Structure } from "../../../../@types/interface";

interface Props {
  letter: string;
  structures: Structure[];
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: bold;
  font-size: 100px;
  padding-left: 72px;
  padding-right: 72px;
  padding-top: 24px;
`;

const StructuresContainer = styled.div`
  margin-left: 64px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const StructureCardContainer = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  background: #ffffff;
  border-radius: 12px;
  width: 368px;
  height: 147px;
  margin-right: 8px;
  margin-left: 8px;
  margin-bottom: 16px;
  padding: 24px;
  cursor: pointer;
`;

interface StructureCardProps {
  nom: string;
}
const StructureCard = (props: StructureCardProps) => (
  <StructureCardContainer>{props.nom}</StructureCardContainer>
);

export const LetterSection = (props: Props) => {
  return (
    <MainContainer>
      {props.letter.toUpperCase()}
      <StructuresContainer>
        {props.structures.map((structure) => (
          <StructureCard nom={structure.nom}></StructureCard>
        ))}
      </StructuresContainer>
    </MainContainer>
  );
};
