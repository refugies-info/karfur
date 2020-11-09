import React, { useState } from "react";
import { Props } from "./AnnuaireLecture.container";
import _ from "lodash";
import styled from "styled-components";
import { Letter } from "./components/Letter";
import { LetterSection } from "./components/LetterSection";
import img from "../../../assets/annuaire/annuaire_lecture.svg";

const Header = styled.div`
  background-image: url(${img});
  height: 330px;
  width: 100%;
  margin-top: -75px;
  position: relative;
`;

const TextContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  background: #ffffff;
  font-weight: bold;
  font-size: 52px;
  line-height: 66px;
  width: fit-content;
  margin-top: 146px;
  margin-left: 72px;
`;

const LettersContainer = styled.div`
  margin-left: 72px;
  width: 100%;
  height: 44px;
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: row;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #e5e5e5;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: 24px;
`;

export interface PropsBeforeInjection {
  t: any;
}
export const AnnuaireLectureComponent = (props: Props) => {
  const [selectedLetter, setSelectedLetter] = useState("a");

  const groupedStructureByLetter = props.structures
    ? _.groupBy(props.structures, (structure) =>
        structure.nom ? structure.nom[0].toLowerCase() : "no name"
      )
    : [];

  const letters = Object.keys(groupedStructureByLetter).sort();
  const lettersLength = letters.length;

  const onLetterClick = (letter: string) => setSelectedLetter(letter);

  return (
    <MainContainer>
      <Header>
        <TextContainer>
          {props.t("Annuaire.Annuaire", "Annuaire")}
        </TextContainer>
        <LettersContainer>
          {letters.map((letter, index) => (
            <Letter
              letter={letter}
              index={lettersLength - index}
              onLetterClick={onLetterClick}
              isSelected={selectedLetter === letter}
            />
          ))}
        </LettersContainer>
      </Header>
      <Content>
        {letters.map((letter) => (
          <LetterSection
            letter={letter}
            // @ts-ignore
            structures={groupedStructureByLetter[letter]}
          />
        ))}
      </Content>
    </MainContainer>
  );
};
