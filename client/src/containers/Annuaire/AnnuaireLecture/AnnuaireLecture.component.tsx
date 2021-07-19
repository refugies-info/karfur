import React, { useState, useEffect } from "react";
import { Props } from "./AnnuaireLecture.container";
import styled from "styled-components";
import { LetterSection } from "./components/LetterSection";
import { ObjectId } from "mongodb";
import { fetchActiveStructuresActionCreator } from "../../../services/ActiveStructures/activeStructures.actions";
import { useDispatch, useSelector } from "react-redux";
import { activeStructuresSelector } from "../../../services/ActiveStructures/activeStructures.selector";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { setSelectedStructureActionCreator } from "../../../services/SelectedStructure/selectedStructure.actions";
import { Header } from "./components/Header";
import Skeleton from "react-loading-skeleton";
import { Event, initGA } from "../../../tracking/dispatch";
import { SimplifiedStructure } from "types/interface";
import { NoResult } from "./components/NoResult";

declare const window: Window;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #e5e5e5;
`;

const LoadingContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: row;
`;
const Content = styled.div`
  display: flex;
  flex-direction: row;
  flew-wrap: wrap;
  margin-top: ${(props) =>
    props.stopScroll ? "140px" : -props.currentScroll + "px"};
  margin-bottom: ${(props) => (props.hasMarginBottom ? "24px" : "0px")};
`;

const LoadingCardContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 198px;
  height: 271px;
  margin-right: 8px;
  margin-left: 8px;
  margin-bottom: 16px;
  padding: 24px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GreyContainer = styled.div`
  border-radius: 12px;
  width: 100%;
  margin-bottom: 24px;
`;

const LoadingCard = () => (
  <LoadingCardContainer>
    <GreyContainer>
      <Skeleton height={100} />
    </GreyContainer>
    <GreyContainer>
      <Skeleton count={2} />
    </GreyContainer>
  </LoadingCardContainer>
);
export interface PropsBeforeInjection {
  t: any;
  history: any;
}
export const AnnuaireLectureComponent = (props: Props) => {
  const [stopScroll, setStopScroll] = useState(false);
  const [currentScroll, setCurrentScroll] = useState(0);
  const [letterSelected, setLetterSelected] = useState("");
  //@ts-ignore
  const [filteredStructures, setFilteredStructures] = useState<
    SimplifiedStructure[]
  >([]);
  const [filteredStructuresByKeyword, setFilteredStructuresByKeyword] =
    useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [typeSelected, setTypeSelected] = useState<string[]>([]);
  const [ville, setVille] = useState("");
  const [depName, setDepName] = useState("");
  const [depNumber, setDepNumber] = useState(null);
  const [isCityFocus, setIsCityFocus] = useState(false);
  const [isCitySelected, setIsCitySelected] = useState(false);

  const structures = useSelector(activeStructuresSelector);
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_STRUCTURES)
  );
  const resetAllFilter = () => {
    setIsCitySelected(false);
    setIsCityFocus(false);
    setDepNumber(null);
    setDepName("");
    setVille("");
    setTypeSelected([]);
    setKeyword("");
  };
  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setCurrentScroll(currentScrollPos);
    if (currentScrollPos >= 85) {
      return setStopScroll(true);
    }
    if (currentScrollPos <= 85) return setStopScroll(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const loadStructures = () => {
      dispatch(setSelectedStructureActionCreator(null));
      dispatch(fetchActiveStructuresActionCreator());
    };

    loadStructures();
    window.addEventListener("scroll", handleScroll);
    window.scrollTo(0, 0);

    initGA();
    Event("ANNUAIRE_VIEW", "VIEW", "label");
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  const resetSearch = () => {
    const filterStructures = structures
      ? structures.filter(
          // @ts-ignore
          (structure) => structure._id !== "5f69cb9c0aab6900460c0f3f"
        )
      : [];

    const sortedStructureByAlpha = filterStructures
      ? filterStructures.sort((a, b) =>
          a.nom[0].toLowerCase() < b.nom[0].toLowerCase()
            ? -1
            : a.nom[0].toLowerCase() > b.nom[0].toLowerCase()
            ? 1
            : 0
        )
      : [];

    setFilteredStructures(sortedStructureByAlpha);
  };

  useEffect(() => {
    resetSearch();
  }, [structures]);
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const onStructureCardClick = (id: ObjectId) =>
    props.history.push(`/annuaire/${id}`);
  if (isLoading) {
    const emptyArray = new Array(7).fill("a");
    return (
      <MainContainer>
        <Header
          letters={letters}
          // onLetterClick={onLetterClick}
          stopScroll={stopScroll}
          currentScroll={currentScroll}
          t={props.t}
          letterSelected={letterSelected}
          setLetterSelected={setLetterSelected}
          setFilteredStructures={setFilteredStructures}
          filteredStructures={filteredStructures}
          filteredStructuresByKeyword={filteredStructuresByKeyword}
          setFilteredStructuresByKeyword={setFilteredStructuresByKeyword}
          resetSearch={resetSearch}
          keyword={keyword}
          setKeyword={setKeyword}
          typeSelected={typeSelected}
          setTypeSelected={setTypeSelected}
          ville={ville}
          setVille={setVille}
          depName={depName}
          setDepName={setDepName}
          depNumber={depNumber}
          setDepNumber={setDepNumber}
          isCityFocus={isCityFocus}
          setIsCityFocus={setIsCityFocus}
          isCitySelected={isCitySelected}
          setIsCitySelected={setIsCitySelected}
        />
        <LoadingContainer>
          <div
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {emptyArray.map((index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </LoadingContainer>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Header
        resetSearch={resetSearch}
        letters={letters}
        stopScroll={stopScroll}
        currentScroll={currentScroll}
        t={props.t}
        letterSelected={letterSelected}
        setLetterSelected={setLetterSelected}
        setFilteredStructures={setFilteredStructures}
        setFilteredStructuresByKeyword={setFilteredStructuresByKeyword}
        filteredStructures={filteredStructures}
        filteredStructuresByKeyword={filteredStructuresByKeyword}
        keyword={keyword}
        setKeyword={setKeyword}
        typeSelected={typeSelected}
        setTypeSelected={setTypeSelected}
        ville={ville}
        setVille={setVille}
        depName={depName}
        setDepName={setDepName}
        depNumber={depNumber}
        setDepNumber={setDepNumber}
        isCityFocus={isCityFocus}
        setIsCityFocus={setIsCityFocus}
        isCitySelected={isCitySelected}
        setIsCitySelected={setIsCitySelected}
      />
      <Content
        currentScroll={currentScroll}
        stopScroll={stopScroll}
        hasMarginBottom={true}
      >
        {keyword !== "" && filteredStructuresByKeyword.length ? (
          <LetterSection
            onStructureCardClick={onStructureCardClick}
            // @ts-ignore
            structures={filteredStructuresByKeyword}
            setLetterSelected={setLetterSelected}
          />
        ) : keyword === "" && filteredStructures.length > 0 ? (
          <LetterSection
            onStructureCardClick={onStructureCardClick}
            // @ts-ignore
            structures={filteredStructures}
            setLetterSelected={setLetterSelected}
          />
        ) : (
          <NoResult resetAllFilter={resetAllFilter} t={props.t} />
        )}
      </Content>
    </MainContainer>
  );
};
