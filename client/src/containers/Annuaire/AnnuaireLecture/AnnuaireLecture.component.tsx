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
import { Spinner } from "reactstrap";
import { setSelectedStructureActionCreator } from "../../../services/SelectedStructure/selectedStructure.actions";
import { Header } from "./components/Header";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #e5e5e5;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => (props.stopScroll ? "256px" : "0px")};
  margin-bottom: ${(props) => (props.hasMarginBottom ? "24px" : "0px")};
`;

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
    return <Spinner />;
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
