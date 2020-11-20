import React, { useEffect } from "react";
import styled from "styled-components";
import "./AnnuaireDetail.scss";
import { fetchSelectedStructureActionCreator } from "../../../../services/SelectedStructure/selectedStructure.actions";
import { useDispatch, useSelector } from "react-redux";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { selectedStructureSelector } from "../../../../services/SelectedStructure/selectedStructure.selector";
import { Spinner } from "reactstrap";
import { LeftAnnuaireDetail } from "./components/LeftAnnuaireDetail";
import { MiddleAnnuaireDetail } from "./components/MiddleAnnuaireDetails";
import { RightAnnuaireDetails } from "./components/RightAnnuaireDetails";
import { Header } from "../components/Header";
import { structuresSelector } from "../../../../services/Structures/structures.selector";
import _ from "lodash";
import { fetchStructuresNewActionCreator } from "../../../../services/Structures/structures.actions";

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

  useEffect(() => {
    const loadStructure = async () => {
      await dispatch(fetchSelectedStructureActionCreator(structureId));
    };
    const loadStructures = async () => {
      await dispatch(fetchStructuresNewActionCreator());
    };

    loadStructures();
    if (structureId) {
      loadStructure();
    }

    // @ts-ignore
    window.scrollTo(0, 0);
  }, [dispatch, structureId]);

  const structures = useSelector(structuresSelector);
  const groupedStructureByLetter = structures
    ? _.groupBy(structures, (structure) =>
        structure.nom ? structure.nom[0].toLowerCase() : "no name"
      )
    : [];

  const letters = Object.keys(groupedStructureByLetter).sort();

  // @ts-ignore
  const leftPartHeight = window.screen.height - 225;
  if (isLoading || !structure) {
    return <Spinner />;
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
        />

        <MiddleAnnuaireDetail
          structure={structure}
          leftPartHeight={leftPartHeight}
        />
        <RightAnnuaireDetails
          leftPartHeight={leftPartHeight}
          dispositifsAssocies={structure && structure.dispositifsAssocies}
          history={props.history}
        />
      </Content>
    </MainContainer>
  );
};
