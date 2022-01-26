import React, { useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import img from "assets/annuaire/annuaire_cover.svg";
import { Letter } from "./Letter";
import i18n from "i18n";
import { SearchBarAnnuaire } from "./SearchBarAnnuaire";
import { colors } from "colors";
import { SimplifiedStructure } from "types/interface";
import { useTranslation } from "react-i18next";

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

const GreyBlockContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 400px;
  margin-top: -90px;
  background: linear-gradient(#e6e6e6, rgba(246, 246, 246, 0));
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
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.25));
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
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.25));
  z-index: -1;
`;

const SearchContainer = styled.div`
  display: flex;
`;

interface Props {
  letters: string[];
  stopScroll: boolean;
  currentScroll: number;
  filteredStructures: SimplifiedStructure[] | null;
  typeSelected: string[] | null;
  setTypeSelected: (a: string[]) => void;
  ville: string;
  setVille: (a: string) => void;
  depName: string;
  setDepName: (a: string) => void;
  depNumber: string | null;
  setDepNumber: (a: string) => void;
  isCityFocus: boolean;
  setIsCityFocus: (a: boolean) => void;
  isCitySelected: boolean;
  setIsCitySelected: (a: boolean) => void;
  resetSearch: () => void;
  keyword: string;
  setKeyword: (a: string) => void;
  lettersClickable: string[];
}

export const Header = (props: Props) => {
  const isRTL = ["ar", "ps", "fa"].includes(i18n.language);
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <GreyBlockContainer />
      <HeaderContainer
        currentScroll={props.currentScroll}
        stopScroll={props.stopScroll}
      >
        <SearchContainer>
          {" "}
          <TextContainer isRTL={isRTL}>
            {t("Annuaire.Annuaire", "Annuaire")}
          </TextContainer>
          <SearchBarAnnuaire
            filteredStructures={props.filteredStructures}
            t={t}
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
              <Link
                href={
                  props.lettersClickable.includes(letter.toLocaleUpperCase())
                    ? `/annuaire#${letter.toUpperCase()}`
                    : "/annuaire"
                }
                key={letter}
                passHref
              >
                <Letter
                  letter={letter}
                  isClickable={props.lettersClickable.includes(
                    letter.toLocaleUpperCase()
                  )}
                />
              </Link>
            ))}
          </>
        </LettersContainer>
      </HeaderContainer>
    </>
  );
};
