import React from "react";
import styled from "styled-components";
import { Structure, Picture } from "../../../../@types/interface";
import "./LetterSection.scss";
// @ts-ignore
import LinesEllipsis from "react-lines-ellipsis";
import { ObjectId } from "mongodb";

interface Props {
  letter: string;
  structures: Structure[];
  onStructureCardClick: (id: ObjectId) => void;
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

const LetterContainer = styled.div`
  font-size: 100px;
  line-height: 58px;
  margin-top: 30px;
  width: 127px;
`;

const StructuresContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
`;
const StructureCardContainer = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  background: #ffffff;
  border-radius: 12px;
  width: 198px;
  height: 271px;
  margin-right: 8px;
  margin-left: 8px;
  margin-bottom: 16px;
  padding: 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  backrgound: red;
`;

const Anchor = styled.div`
  margin-top: -250px;
`;

interface StructureCardProps {
  nom: string;
  acronyme: string;
  picture: Picture;
  onStructureCardClick: (id: ObjectId) => void;
  id: ObjectId;
}
const StructureCard = (props: StructureCardProps) => (
  <StructureCardContainer onClick={() => props.onStructureCardClick(props.id)}>
    {props.picture && props.picture.secure_url && (
      <img
        className="sponsor-img"
        src={props.picture.secure_url}
        alt={props.acronyme}
      />
    )}
    <LinesEllipsis text={props.nom} maxLine="4" trimRight basedOn="letters" />
  </StructureCardContainer>
);

export const LetterSection = (props: Props) => (
  <MainContainer className="letter-section">
    <Anchor id={props.letter.toUpperCase()} />
    <LetterContainer>{props.letter.toUpperCase()}</LetterContainer>
    <StructuresContainer>
      {props.structures.map((structure) => (
        <StructureCard
          key={structure.nom}
          nom={structure.nom}
          picture={structure.picture || {}}
          acronyme={structure.acronyme}
          onStructureCardClick={props.onStructureCardClick}
          id={structure._id}
        />
      ))}
    </StructuresContainer>
  </MainContainer>
);
