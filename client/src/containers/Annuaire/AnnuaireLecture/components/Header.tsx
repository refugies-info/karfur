import React from "react";
import styled from "styled-components";
import img from "../../../../assets/annuaire/annuaire_lecture.svg";
import { Letter } from "./Letter";
import { NavHashLink } from "react-router-hash-link";
import i18n from "../../../../i18n";
import { SearchBarAnnuaire } from "./SearchBarAnnuaire";

const HeaderContainer = styled.div`
  background-attachment: fixed;
  background-image: url(${img});
  height: 330px;
  width: 100%;
  margin-top: ${(props) => (props.stopScroll ? "-250px" : "-75px")};
  position: ${(props) => (props.stopScroll ? "fixed" : "relative")};
  z-index: 1;
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
  margin-right: ${(props) => props.isRTL && "72px"};
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
  t: any;
}

export const Header = (props: Props) => {
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
  return (
    <HeaderContainer stopScroll={props.stopScroll}>
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
              to={`/annuaire#${letter.toUpperCase()}`}
              smooth={true}
              key={letter}
            >
              <Letter
                letter={letter}
                index={props.letters.length - index}
                //   onLetterClick={props.onLetterClick}
                isSelected={false}
              />
            </NavHashLink>
          ))}
        </>
      </LettersContainer>
    </HeaderContainer>
  );
};
