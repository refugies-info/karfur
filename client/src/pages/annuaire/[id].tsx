import React, { useEffect, useState, useLayoutEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import _ from "lodash";
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
import SEO from "components/Seo";
import { wrapper } from "services/configureStore";
import { END } from "redux-saga";
import { Context } from "next-redux-wrapper";
import { NextPageContext } from "next";
import { ObjectId } from "mongodb";

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

interface Props {
  history: string[]
}

const AnnuaireDetail = (props: Props) => {
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_STRUCTURE)
  );
  const structure = useSelector(selectedStructureSelector);
  const user = useSelector(userSelector);

  const dispatch = useDispatch();
  const router = useRouter()
  const structureId = router.query.id as string;

  const locale = router.locale || "fr";
  const [currentLoadedLocale, setCurrentLoadedLocale] = useState(locale);

  // Reload structure if locale change
  useEffect(() => {
    if (structureId && currentLoadedLocale !== locale) {
      dispatch(
        fetchSelectedStructureActionCreator({
          id: structureId as string,
          locale
        })
      );
      setCurrentLoadedLocale(locale);
    }
  }, [dispatch, locale, currentLoadedLocale, structureId]);

  const isMember =
    structure && structure.membres && structure.membres.find((el: any) => el._id === user.userId)
      ? true
      : false;

  return (
    <MainContainer>
      <SEO />
      <Content className="annuaire-detail">
        <LeftAnnuaireDetail
          structure={structure}
          isLoading={isLoading}
          history={props.history}
        />

        <MiddleAnnuaireDetail
          structure={structure}
          isLoading={isLoading}
          isMember={isMember}
        />
        {!isLoading && structure &&
          <RightAnnuaireDetails
            dispositifsAssocies={structure && structure.dispositifsAssocies}
          />
        }
      </Content>
    </MainContainer>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({query, locale}) => {
  if (query.id) {
    const action = fetchSelectedStructureActionCreator({
      id: query.id as string,
      locale: locale || "fr"
    });
    store.dispatch(action);
    store.dispatch(END);
    await store.sagaTask?.toPromise();
  }
  return {
    props: {
      ...(await serverSideTranslations(locale || "fr", ["common"])),
    },
  }
});

export default AnnuaireDetail;
