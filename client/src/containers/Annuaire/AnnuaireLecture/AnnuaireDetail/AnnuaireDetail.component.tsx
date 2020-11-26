import React, { useEffect } from "react";
import styled from "styled-components";
import "./AnnuaireDetail.scss";
import { fetchSelectedStructureActionCreator } from "../../../../services/SelectedStructure/selectedStructure.actions";
import { useDispatch, useSelector } from "react-redux";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { selectedStructureSelector } from "../../../../services/SelectedStructure/selectedStructure.selector";
import { LeftAnnuaireDetail } from "./components/LeftAnnuaireDetail";
import { MiddleAnnuaireDetail } from "./components/MiddleAnnuaireDetails";
import { RightAnnuaireDetails } from "./components/RightAnnuaireDetails";
import { Header } from "../components/Header";
import { structuresSelector } from "../../../../services/Structures/structures.selector";
import _ from "lodash";
import { fetchStructuresNewActionCreator } from "../../../../services/Structures/structures.actions";
import i18n from "../../../../i18n";
export interface PropsBeforeInjection {
  t: any;
  history: any;
}

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  margin-top: 75px;
  height: 90hv;
`;

const MainContainer = styled.div``;

export const AnnuaireDetail = (props: PropsBeforeInjection) => {
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_STRUCTURE)
  );

  const structure = useSelector(selectedStructureSelector);

  const dispatch = useDispatch();
  // @ts-ignore
  const structureId =
    // @ts-ignore
    props.match && props.match.params && props.match.params.id;

  const structures = useSelector(structuresSelector);

  const locale = i18n.language;
  useEffect(() => {
    const loadStructure = async () => {
      await dispatch(
        fetchSelectedStructureActionCreator({ id: structureId, locale })
      );
    };
    const loadStructures = async () => {
      await dispatch(fetchStructuresNewActionCreator());
    };

    if (!structures || structures.length === 0) {
      loadStructures();
    }
    if (structureId) {
      loadStructure();
    }

    // @ts-ignore
    window.scrollTo(0, 0);
  }, [dispatch, structureId, locale]);

  // we do not show our temporary structure in production
  const filterStructures = structures
    ? structures.filter(
        // @ts-ignore
        (structure) => structure._id !== "5f69cb9c0aab6900460c0f3f"
      )
    : [];

  const groupedStructureByLetter =
    filterStructures && filterStructures.length > 0
      ? _.groupBy(filterStructures, (structure) =>
          structure.nom ? structure.nom[0].toLowerCase() : "no name"
        )
      : [];

  const letters = Object.keys(groupedStructureByLetter).sort();

  // @ts-ignore
  const leftPartHeight = window.screen.height - 225;

  if (isLoading || !structure) {
    return (
      <MainContainer>
        <Header
          letters={letters}
          // onLetterClick={onLetterClick}
          stopScroll={true}
          t={props.t}
        />

        <Content className="annuaire-detail" height={leftPartHeight}>
          <LeftAnnuaireDetail
            structure={structure}
            leftPartHeight={leftPartHeight}
            t={props.t}
            isLoading={isLoading}
          />
          <MiddleAnnuaireDetail
            structure={structure}
            leftPartHeight={leftPartHeight}
            t={props.t}
            isLoading={isLoading}
          />
        </Content>
      </MainContainer>
    );
  }
  return (
    <MainContainer>
      <Header
        letters={letters}
        // onLetterClick={onLetterClick}
        stopScroll={true}
        t={props.t}
      />

      <Content className="annuaire-detail" height={leftPartHeight}>
        <LeftAnnuaireDetail
          structure={structure}
          leftPartHeight={leftPartHeight}
          t={props.t}
          isLoading={isLoading}
        />

        <MiddleAnnuaireDetail
          structure={structure}
          leftPartHeight={leftPartHeight}
          t={props.t}
          isLoading={isLoading}
        />
        <RightAnnuaireDetails
          leftPartHeight={leftPartHeight}
          dispositifsAssocies={structure && structure.dispositifsAssocies}
          history={props.history}
          t={props.t}
        />
      </Content>
    </MainContainer>
  );
};
