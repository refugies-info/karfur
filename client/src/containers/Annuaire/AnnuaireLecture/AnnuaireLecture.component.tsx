import React, { useState, useEffect } from "react";
import { Props } from "./AnnuaireLecture.container";
import _ from "lodash";
import styled from "styled-components";
import { LetterSection } from "./components/LetterSection";
import { ObjectId } from "mongodb";
import { fetchStructuresNewActionCreator } from "../../../services/Structures/structures.actions";
import { useDispatch, useSelector } from "react-redux";
import { structuresSelector } from "../../../services/Structures/structures.selector";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { setSelectedStructureActionCreator } from "../../../services/SelectedStructure/selectedStructure.actions";
import { Header } from "./components/Header";
import Skeleton from "react-loading-skeleton";

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
  flex-direction: column;
  margin-top: ${(props) => (props.stopScroll ? "256px" : "0px")};
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

const Letter = styled.div`
  font-size: 100px;
  line-height: 58px;
  margin-top: 30px;
  margin-left: 72px;
  margin-right: 72px;
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
  // @ts-ignore
  // const param = props.location.state;
  // const [selectedLetter, setSelectedLetter] = useState(
  //   (param && param.letter) || "a"
  // );
  const [stopScroll, setStopScroll] = useState(false);

  const structures = useSelector(structuresSelector);
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_STRUCTURES)
  );

  const handleScroll = () => {
    // @ts-ignore
    const currentScrollPos = window.pageYOffset;

    if (currentScrollPos >= 175) {
      return setStopScroll(true);
    }
    if (currentScrollPos <= 175) return setStopScroll(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const loadStructures = async () => {
      await dispatch(setSelectedStructureActionCreator(null));
      await dispatch(fetchStructuresNewActionCreator());
    };

    loadStructures();

    // @ts-ignore
    window.addEventListener("scroll", handleScroll);

    return () => {
      // @ts-ignore
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  const groupedStructureByLetter = structures
    ? _.groupBy(structures, (structure) =>
        structure.nom ? structure.nom[0].toLowerCase() : "no name"
      )
    : [];

  const letters = Object.keys(groupedStructureByLetter).sort();

  // const onLetterClick = (letter: string) => setSelectedLetter(letter);

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
          t={props.t}
        />
        <LoadingContainer>
          <Letter>A</Letter>
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
        letters={letters}
        // onLetterClick={onLetterClick}
        stopScroll={stopScroll}
        t={props.t}
      />
      <Content stopScroll={stopScroll} hasMarginBottom={true}>
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
      </Content>
    </MainContainer>
  );
};
