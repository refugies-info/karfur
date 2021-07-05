import React, { useEffect, useState, useLayoutEffect } from "react";
import styled from "styled-components";
import "./AnnuaireDetail.scss";
import API from "../../../../utils/API";
import { useDispatch, useSelector } from "react-redux";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { selectedStructureSelector } from "../../../../services/SelectedStructure/selectedStructure.selector";
import { userSelector } from "../../../../services/User/user.selectors";
import { LeftAnnuaireDetail } from "./components/LeftAnnuaireDetail";
import { MiddleAnnuaireDetail } from "./components/MiddleAnnuaireDetails";
import { RightAnnuaireDetails } from "./components/RightAnnuaireDetails";
import { fetchSelectedStructureActionCreator } from "../../../../services/SelectedStructure/selectedStructure.actions";
import { fetchActiveStructuresActionCreator } from "../../../../services/ActiveStructures/activeStructures.actions";
import { activeStructuresSelector } from "../../../../services/ActiveStructures/activeStructures.selector";
import { colors } from "../../../../colors";
import _ from "lodash";
import i18n from "../../../../i18n";
export interface PropsBeforeInjection {
  t: any;
  history: any;
}

declare const window: Window;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;

  height: 100hv;
`;
declare global {
  interface Window {
    scrollTo: (arg1: number, arg2: number) => void;
    innerHeight: number;
  }
}

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  margin-top: -75px;
  background-color: ${colors.gris};
`;

function useWindowSize() {
  const [size, setSize] = useState(0);

  useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerHeight);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export const AnnuaireDetail = (props: PropsBeforeInjection) => {
  const [members, setMembers] = useState([]);
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_STRUCTURE)
  );

  const structure = useSelector(selectedStructureSelector);

  const user = useSelector(userSelector);

  const height = useWindowSize();
  const dispatch = useDispatch();
  // @ts-ignore
  const structureId =
    // @ts-ignore
    props.match && props.match.params && props.match.params.id;

  const locale = i18n.language;
  const leftPartHeight = height - 150;
  const structures = useSelector(activeStructuresSelector);
  useEffect(() => {
    const loadStructure = async () => {
      dispatch(
        fetchSelectedStructureActionCreator({ id: structureId, locale })
      );
    };
    const loadStructures = async () => {
      dispatch(fetchActiveStructuresActionCreator());
    };

    if (!structures || structures.length === 0) {
      loadStructures();
    }
    if (structureId) {
      loadStructure();
    }
    API.getStructureById(structureId, false, locale, true).then((res: any) =>
      setMembers(res.data.data.membres)
    );

    window.scrollTo(0, 0);
  }, [dispatch, structureId, locale]);

  if (isLoading || !structure) {
    return (
      <MainContainer>
        <Content className="annuaire-detail">
          <LeftAnnuaireDetail
            structure={structure}
            leftPartHeight={leftPartHeight}
            t={props.t}
            isLoading={isLoading}
            history={props.history}
          />
          <MiddleAnnuaireDetail
            structure={structure}
            leftPartHeight={leftPartHeight}
            t={props.t}
            isLoading={isLoading}
            members={members}
            userId={user.userId}
          />
        </Content>
      </MainContainer>
    );
  }
  return (
    <MainContainer>
      <Content className="annuaire-detail">
        <LeftAnnuaireDetail
          structure={structure}
          leftPartHeight={leftPartHeight}
          t={props.t}
          isLoading={isLoading}
          history={props.history}
        />

        <MiddleAnnuaireDetail
          structure={structure}
          leftPartHeight={leftPartHeight}
          t={props.t}
          isLoading={isLoading}
          members={members}
          userId={user.userId}
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
