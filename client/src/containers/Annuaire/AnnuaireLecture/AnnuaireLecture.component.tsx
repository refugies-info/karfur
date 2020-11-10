import React, { useState, useEffect } from "react";
import { Props } from "./AnnuaireLecture.container";
import _ from "lodash";
import styled from "styled-components";
import { Letter } from "./components/Letter";
import { LetterSection } from "./components/LetterSection";
import img from "../../../assets/annuaire/annuaire_lecture.svg";
// @ts-ignore
import AnchorLink from "react-anchor-link-smooth-scroll";
import { ObjectId } from "mongodb";
import { AnnuaireDetail } from "./AnnuaireDetail/AnnuaireDetail";

const Header = styled.div`
  background-image: url(${img});
  height: 330px;
  width: 100%;
  margin-top: ${(props) => (props.stopScroll ? "-250px" : "-75px")};
  position: ${(props) => (props.stopScroll ? "fixed" : "relative")};
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
  margin-top: ${(props) => (props.stopScroll ? "256px" : "0px")};
  margin-bottom: 24px;
`;

export interface PropsBeforeInjection {
  t: any;
  history: any;
}
export const AnnuaireLectureComponent = (props: Props) => {
  const [selectedLetter, setSelectedLetter] = useState("a");
  const [stopScroll, setStopScroll] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<ObjectId | null>(
    null
  );

  const handleScroll = () => {
    // @ts-ignore
    const currentScrollPos = window.pageYOffset;

    if (currentScrollPos >= 175) {
      return setStopScroll(true);
    }
    if (currentScrollPos <= 175) return setStopScroll(false);
  };

  useEffect(() => {
    // @ts-ignore
    window.addEventListener("scroll", handleScroll);

    return () => {
      // @ts-ignore
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const groupedStructureByLetter = props.structures
    ? _.groupBy(props.structures, (structure) =>
        structure.nom ? structure.nom[0].toLowerCase() : "no name"
      )
    : [];

  const letters = Object.keys(groupedStructureByLetter).sort();
  const lettersLength = letters.length;

  const onLetterClick = (letter: string) => {
    setSelectedLetter(letter);

    // if (selectedStructure) {
    //   setSelectedStructure(null);
    //   props.history.push("/annuaire#" + letter.toUpperCase());
    // }
  };

  const getSelectedStructure = () =>
    props.structures.filter(
      (structure) => structure._id === selectedStructure
    )[0];

  const onStructureCardClick = (id: ObjectId) => setSelectedStructure(id);
  return (
    <MainContainer>
      <Header stopScroll={stopScroll}>
        <TextContainer>
          {props.t("Annuaire.Annuaire", "Annuaire")}
        </TextContainer>
        <LettersContainer>
          {!selectedStructure && (
            <>
              {letters.map((letter, index) => (
                <AnchorLink
                  offset="60"
                  href={"#" + letter.toUpperCase()}
                  key={letter}
                >
                  <Letter
                    letter={letter}
                    index={lettersLength - index}
                    onLetterClick={onLetterClick}
                    isSelected={selectedLetter === letter}
                    key={letter}
                  />
                </AnchorLink>
              ))}
            </>
          )}
          {selectedStructure && (
            <>
              {letters.map((letter, index) => (
                <Letter
                  letter={letter}
                  index={lettersLength - index}
                  onLetterClick={onLetterClick}
                  isSelected={selectedLetter === letter}
                  key={letter}
                />
              ))}
            </>
          )}
        </LettersContainer>
      </Header>
      <Content stopScroll={stopScroll}>
        {!selectedStructure && (
          <>
            {letters.map((letter) => (
              <LetterSection
                onStructureCardClick={onStructureCardClick}
                key={letter}
                letter={letter}
                // @ts-ignore
                structures={groupedStructureByLetter[letter]}
              />
            ))}
          </>
        )}
        {selectedStructure && (
          <AnnuaireDetail structure={getSelectedStructure()} />
        )}
      </Content>
    </MainContainer>
  );
};
