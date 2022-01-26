import React, { useEffect, useState, useLayoutEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import i18n from "i18n";
import { useRouter } from "next/router";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { selectedStructureSelector } from "services/SelectedStructure/selectedStructure.selector";
import { userSelector } from "services/User/user.selectors";
import { LeftAnnuaireDetail } from "components/Pages/annuaire/id/LeftAnnuaireDetail";
import { MiddleAnnuaireDetail } from "components/Pages/annuaire/id/MiddleAnnuaireDetails";
import { RightAnnuaireDetails } from "components/Pages/annuaire/id/RightAnnuaireDetails";
import { fetchSelectedStructureActionCreator } from "services/SelectedStructure/selectedStructure.actions";
import { colors } from "colors";

declare const window: Window;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 0%;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  max-height: 105vh;
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

const AnnuaireDetail = () => {
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_STRUCTURE)
  );

  const structure = useSelector(selectedStructureSelector);

  const user = useSelector(userSelector);

  const height = useWindowSize();
  const dispatch = useDispatch();
  const router = useRouter()
  const structureId = router.query.id;

  const locale = i18n.language;
  const leftPartHeight = height - 150;

  useEffect(() => {
    const loadStructure = () => {
      dispatch(
        //@ts-ignore
        fetchSelectedStructureActionCreator({ id: structureId, locale })
      );
    };

    if (structureId) {
      loadStructure();
    }
  }, [dispatch, structureId, locale]);

  const isMember =
    structure && structure.membres && structure.membres.find((el: any) => el._id === user.userId)
      ? true
      : false;

  if (isLoading || !structure) {
    return (
      <MainContainer>
        <Content className="annuaire-detail">
          <LeftAnnuaireDetail
            structure={structure}
            leftPartHeight={leftPartHeight}
            isLoading={isLoading}
          />
          <MiddleAnnuaireDetail
            structure={structure}
            leftPartHeight={leftPartHeight}
            isLoading={isLoading}
            isMember={isMember}
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
          isLoading={isLoading}
        />

        <MiddleAnnuaireDetail
          structure={structure}
          leftPartHeight={leftPartHeight}
          isLoading={isLoading}
          isMember={isMember}
        />
        <RightAnnuaireDetails
          leftPartHeight={leftPartHeight}
          dispositifsAssocies={structure && structure.dispositifsAssocies}
        />
      </Content>
    </MainContainer>
  );
};

export default AnnuaireDetail;
