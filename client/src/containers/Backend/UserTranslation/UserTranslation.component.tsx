import React, { useEffect, useState } from "react";
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
import { LoadingDispositifsWithTranslationsStatus } from "./components/LoadingDispositifsWithTranslationsStatus";
import { StartTranslating } from "./components/StartTranslating";
import { TranslationsAvancement } from "./components/TranslationsAvancement";
import styled from "styled-components";
import { colors } from "../../../colors";
import { TranslationLanguagesChoiceModal } from "./components/TranslationLanguagesChoiceModal";
import { FrameModal } from "../../../components/Modals";
import { CompleteProfilModal } from "../../../components/Modals/CompleteProfilModal/CompleteProfilModal";

import API from "../../../utils/API";
import { Indicators } from "../../../types/interface";
import { Navigation } from "../Navigation";

declare const window: Window;
export interface PropsBeforeInjection {
  match: any;
  history: any;
  user: { username: string; password: string; email?: string };
}

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const availableLanguages = ["fa", "en", "ru", "ps", "ar", "ti-ER"];

export const UserTranslationComponent = (props: Props) => {
  const [showTraducteurModal, setShowTraducteurModal] = useState(false);
  const [showCompleteProfilModal, setShowCompleteProfilModal] = useState(false);
  const toggleTraducteurModal = () =>
    setShowTraducteurModal(!showTraducteurModal);
  const toggleCompleteProfilModal = () =>
    setShowCompleteProfilModal(!showCompleteProfilModal);
  const [showTutoModal, setShowTutoModal] = useState(false);
  const toggleTutoModal = () => setShowTutoModal(!showTutoModal);

  const [elementToTranslate, setElementToTranslate] = useState(null);

  const [indicators, setIndicators] = useState<null | Indicators>(null);

  const langueInUrl = props.match.params.id;

  const userTradLanguages = useSelector(userSelectedLanguageSelector);
  const userFirstTradLanguage =
    userTradLanguages.length > 0 ? userTradLanguages[0].i18nCode : null;
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

  const getLangueId = () => {
    if (!userTradLanguages || userTradLanguages.length === 0) return null;
    const langueArray = userTradLanguages.filter(
      (langue) => langue.i18nCode === langueInUrl
    );
    // @ts-ignore
    if (langueArray.length > 0) return langueArray[0]._id;
    return null;
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (userFirstTradLanguage && !langueInUrl) {
      return props.history.push(
        "/backend/user-translation/" + userFirstTradLanguage
      );
    }

    if (langueInUrl && !userFirstTradLanguage) {
      return props.history.push("/backend/user-translation");
    }

    if (!availableLanguages.includes(langueInUrl)) {
      return props.history.push("/backend/user-translation");
    }
    const loadIndicators = async () => {
      if (user && user.user) {
        const data = await API.get_progression({
          userId: user.user._id,
        });
        setIndicators(data.data);
      }
    };

    if (langueInUrl) {
      dispatch(
        fetchDispositifsWithTranslationsStatusActionCreator(langueInUrl)
      );
      loadIndicators();
    }
  }, [langueInUrl, userFirstTradLanguage, isLoadingUser, user]);

  const nbWords =
    indicators &&
    indicators.totalIndicator &&
    indicators.totalIndicator[0] &&
    indicators.totalIndicator[0].wordsCount
      ? indicators.totalIndicator[0].wordsCount
      : 0;

  const timeSpent =
    indicators &&
    indicators.totalIndicator &&
    indicators.totalIndicator[0] &&
    indicators.totalIndicator[0].timeSpent
      ? Math.floor(indicators.totalIndicator[0].timeSpent / 1000 / 60)
      : 0;

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          backgroundColor: colors.gris,
          marginTop: "-95px",
          paddingTop: "100px",
        }}
      >
        <Navigation selected="traductions" />
        <MainContainer>
          <LoadingDispositifsWithTranslationsStatus
            toggleTutoModal={toggleTutoModal}
          />
        </MainContainer>
      </div>
    );

  if (
    dispositifsWithTranslations.length === 0 ||
    userTradLanguages.length === 0
  ) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          backgroundColor: colors.gris,
          marginTop: "-95px",
          paddingTop: "100px",
        }}
      >
        <Navigation selected="traductions" />
        <MainContainer>
          <StartTranslating
            toggleTraducteurModal={toggleTraducteurModal}
            toggleTutoModal={toggleTutoModal}
          />
          {showTraducteurModal && (
            <TranslationLanguagesChoiceModal
              show={showTraducteurModal}
              toggle={toggleTraducteurModal}
            />
          )}
          {showTutoModal && (
            <FrameModal
              show={showTutoModal}
              toggle={toggleTutoModal}
              section={"Traduction"}
            />
          )}
        </MainContainer>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: colors.gris,
        marginTop: "-95px",
        paddingTop: "100px",
      }}
    >
      <Navigation selected="traductions" />
      <MainContainer>
        <TranslationsAvancement
          userTradLanguages={userTradLanguages}
          history={props.history}
          actualLanguage={langueInUrl}
          isExpert={user.expertTrad}
          isAdmin={user.admin}
          data={dispositifsWithTranslations}
          toggleTraducteurModal={toggleTraducteurModal}
          toggleTutoModal={toggleTutoModal}
          nbWords={nbWords}
          timeSpent={timeSpent}
          toggleCompleteProfilModal={toggleCompleteProfilModal}
          setElementToTranslate={setElementToTranslate}
          user={user.user}
          getLangueId={getLangueId}
        />
        {showTraducteurModal && (
          <TranslationLanguagesChoiceModal
            show={showTraducteurModal}
            toggle={toggleTraducteurModal}
          />
        )}
        {showTutoModal && (
          <FrameModal
            show={showTutoModal}
            toggle={toggleTutoModal}
            section={"Traduction"}
          />
        )}
        {showCompleteProfilModal && (
          <CompleteProfilModal
            show={showCompleteProfilModal}
            toggle={toggleCompleteProfilModal}
            history={props.history}
            user={user.user}
            type={"traduction"}
            element={elementToTranslate}
            isExpert={user.expertTrad}
            langueId={getLangueId()}
          />
        )}
      </MainContainer>
    </div>
  );
};
