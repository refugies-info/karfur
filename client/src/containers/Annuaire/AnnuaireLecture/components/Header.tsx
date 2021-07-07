import React, { useState, useEffect } from "react";
import styled from "styled-components";
//import img from "../../../../assets/annuaire/annuaire_lecture.svg";
import { Letter } from "./Letter";
import { NavHashLink } from "react-router-hash-link";
import i18n from "../../../../i18n";
import { SearchBarAnnuaire } from "./SearchBarAnnuaire";
import { colors } from "../../../../colors";

const HeaderContainer = styled.div`
  background-attachment: fixed;

  height: 290px;
  width: 100%;
  margin-top: ${(props) =>
    props.stopScroll
      ? "-140px"
      : -75 - props.currentScroll < -105
      ? "-105px"
      : -75 - props.currentScroll + "px"};
  position: ${(props) => (props.stopScroll ? "fixed" : "relative")};
  z-index: 1;
`;

const TextContainer = styled.div`
  height: 74px;
  padding: 4px 8px 4px 8px;
  background: #ffffff;
  font-weight: bold;
  font-size: 52px;
  line-height: 66px;
  width: fit-content;
  margin-top: 146px;
  margin-left: 72px;
  margin-right: ${(props) => props.isRTL && "72px"};
  color: ${colors.bleuCharte};
`;

const LettersContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 44px;
  position: absolute;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  margin-right: ${(props) => props.isRTL && "72px"};
`;

const SearchContainer = styled.div`
  display: flex;
`;

interface Props {
  letters: string[];
  //   onLetterClick: (letter: string) => void;
  stopScroll: boolean;
  currentScroll: number;
  t: any;
}

export const Header = (props: Props) => {
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
  const [letterSelected, setLetterSelected] = useState("");

  useEffect(() => {
    if (props.currentScroll === 0) {
      setLetterSelected("");
    }
  }, [props.currentScroll]);

  return (
    <HeaderContainer
      currentScroll={props.currentScroll}
      stopScroll={props.stopScroll}
    >
      <SearchContainer>
        {" "}
        <TextContainer isRTL={isRTL}>
          {props.t("Annuaire.Annuaire", "Annuaire")}
        </TextContainer>
        <SearchBarAnnuaire t={props.t} />
      </SearchContainer>

      <LettersContainer isRTL={isRTL}>
        <>
          {props.letters.map((letter, index) => (
            <NavHashLink
              onClick={() => setLetterSelected(letter)}
              to={`/annuaire#${letter.toUpperCase()}`}
              smooth={true}
              key={letter}
            >
              <Letter
                letter={letter}
                isOneSelected={letterSelected === "" ? false : true}
                index={props.letters.length - index}
                //   onLetterClick={props.onLetterClick}
                isSelected={letterSelected === letter ? true : false}
              />
            </NavHashLink>
          ))}
        </>
      </LettersContainer>
    </HeaderContainer>
  );
};
