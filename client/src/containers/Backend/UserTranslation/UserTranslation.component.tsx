/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  userSelectedLanguageSelector,
  userSelector,
} from "../../../services/User/user.selectors";
import { Props } from "./UserTranslation.container";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "../../../services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { dispositifsWithTranslationsStatusSelector } from "../../../services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.selectors";
import { LoadingDispositifsWithTranlastionsStatus } from "./components/LoadingDispositifsWithTranlastionsStatus";
import { StartTranslating } from "./components/StartTranslating";
import { TranslationsAvancement } from "./components/TranslationsAvancement";
import styled from "styled-components";
import { colors } from "../../../colors";

export interface PropsBeforeInjection {
  match: any;
  history: any;
}

const MainContainer = styled.div`
  background-color: ${colors.gris};
  display: flex;
  flex: 1;
  margin-top: -100px;
  padding-top: 100px;
`;
export const UserTranslationComponent = (props: Props) => {
  const langueInUrl = props.match.params.id;
  console.log("param", langueInUrl);

  const userTradLanguages = useSelector(userSelectedLanguageSelector);
  const userFirstTradLanguage =
    userTradLanguages.length > 0 ? userTradLanguages[0].i18nCode : null;
  console.log("userTradLanguages", userTradLanguages);
  const dispatch = useDispatch();

  const isLoadingDispositifs = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS)
  );

  const user = useSelector(userSelector);

  const isLoadingUser = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_USER)
  );

  const isLoading = isLoadingDispositifs || isLoadingUser;

  const dispositifsWithTranslations = useSelector(
    dispositifsWithTranslationsStatusSelector
  );

  useEffect(() => {
    if (isLoadingUser) return;

    if (userFirstTradLanguage && !langueInUrl) {
      return props.history.push(
        "/backend/user-translation/" + userFirstTradLanguage
      );
    }

    if (langueInUrl && !userFirstTradLanguage) {
      return props.history.push("/backend/user-translation");
    }

    if (langueInUrl) {
      dispatch(
        fetchDispositifsWithTranslationsStatusActionCreator(langueInUrl)
      );
    }
  }, [langueInUrl, userFirstTradLanguage, isLoadingUser]);

  if (isLoading || !user)
    return (
      <MainContainer>
        <LoadingDispositifsWithTranlastionsStatus />
      </MainContainer>
    );

  if (
    dispositifsWithTranslations.length === 0 ||
    userTradLanguages.length === 0
  ) {
    return (
      <MainContainer>
        <StartTranslating />
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <TranslationsAvancement
        userTradLanguages={userTradLanguages}
        history={props.history}
        actualLanguage={langueInUrl}
        isExpert={user.expertTrad}
        data={dispositifsWithTranslations}
      />
    </MainContainer>
  );
};
