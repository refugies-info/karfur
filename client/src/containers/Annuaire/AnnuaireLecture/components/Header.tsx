import React, { useEffect } from "react";
import styled from "styled-components";
import img from "../../../../assets/annuaire/annuaire_cover.svg";
import { Letter } from "./Letter";
import { NavHashLink } from "react-router-hash-link";
import i18n from "../../../../i18n";
import { SearchBarAnnuaire } from "./SearBarAnnuaire/SearchBarAnnuaire";
import { colors } from "../../../../colors";
import { SimplifiedStructure } from "types/interface";

const HeaderContainer = styled.div`
  background-image: url(${img});
  background-repeat: no-repeat;
  background-position: 20px ${(props) => -props.currentScroll + "px"};
  height: 290px;
  width: 100%;
  margin-left: 30px;
  margin-top: ${(props) =>
    props.stopScroll
      ? "-140px"
      : -props.currentScroll < -120
      ? "-60px"
      : -props.currentScroll / 2 + "px"};
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
  letterSelected: string;
  setLetterSelected: any;
  setFilteredStructures: any;
  filteredStructures: SimplifiedStructure[] | null;
  filteredStructuresByKeyword: SimplifiedStructure[] | null;
  setFilteredStructuresByKeyword: any;
  typeSelected: string[] | null;
  setTypeSelected: any;
  ville: string;
  setVille: any;
  depName: string;
  setDepName: any;
  depNumber: any;
  setDepNumber: any;
  isCityFocus: boolean;
  setIsCityFocus: any;
  isCitySelected: boolean;
  setIsCitySelected: any;

  t: any;
  resetSearch: () => void;
  keyword: string;
  setKeyword: any;
}

export const Header = (props: Props) => {
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);

  useEffect(() => {
    if (props.currentScroll === 0) {
      props.setLetterSelected("");
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
        <SearchBarAnnuaire
          filteredStructures={props.filteredStructures}
          setFilteredStructuresByKeyword={props.setFilteredStructuresByKeyword}
          setFilteredStructures={props.setFilteredStructures}
          filteredStructuresByKeyword={props.filteredStructuresByKeyword}
          t={props.t}
          resetSearch={props.resetSearch}
          keyword={props.keyword}
          setKeyword={props.setKeyword}
          typeSelected={props.typeSelected}
          setTypeSelected={props.setTypeSelected}
          ville={props.ville}
          setVille={props.setVille}
          depName={props.depName}
          setDepName={props.setDepName}
          depNumber={props.depNumber}
          setDepNumber={props.setDepNumber}
          isCityFocus={props.isCityFocus}
          setIsCityFocus={props.setIsCityFocus}
          isCitySelected={props.isCitySelected}
          setIsCitySelected={props.setIsCitySelected}
        />
      </SearchContainer>

      <LettersContainer isRTL={isRTL}>
        <>
          {props.letters.map((letter, index) => (
            <NavHashLink
              onClick={() => props.setLetterSelected(letter)}
              to={`/annuaire#${letter.toUpperCase()}`}
              smooth={true}
              key={letter}
            >
              <Letter
                letter={letter}
                isOneSelected={props.letterSelected === "" ? false : true}
                index={props.letters.length - index}
                //   onLetterClick={props.onLetterClick}
                isSelected={props.letterSelected === letter ? true : false}
              />
            </NavHashLink>
          ))}
        </>
      </LettersContainer>
    </HeaderContainer>
  );
};
