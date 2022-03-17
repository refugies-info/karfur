import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  userSelectedLanguageSelector,
  userSelector,
} from "services/User/user.selectors";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { dispositifsWithTranslationsStatusSelector } from "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.selectors";
import { LoadingDispositifsWithTranslationsStatus } from "./components/LoadingDispositifsWithTranslationsStatus";
import { StartTranslating } from "./components/StartTranslating";
import { TranslationsAvancement } from "./components/TranslationsAvancement";
import { colors } from "colors";
import { TranslationLanguagesChoiceModal } from "./components/TranslationLanguagesChoiceModal";
import { FrameModal } from "components/Modals";
import { CompleteProfilModal } from "components/Modals/CompleteProfilModal/CompleteProfilModal";

import API from "utils/API";
import { Indicators, UserLanguage } from "types/interface";
import Navigation from "../Navigation";
import { TranslationNeedsModal } from "./components/TranslationNeedsModal";
import { OneNeedTranslationModal } from "./components/OneNeedTranslationModal";
import { ObjectId } from "mongodb";
import { needsSelector } from "services/Needs/needs.selectors";
import styles from "./UserTranslation.module.scss";
import { activatedLanguages } from "data/activatedLanguages";
import { useRouter } from "next/router";

const availableLanguages = activatedLanguages.map(l => l.i18nCode).filter(ln => ln !== "fr");
const getLangueName = (
  langueId: ObjectId | null,
  userTradLanguages: UserLanguage[]
) => {
  if (!langueId) return { langueSelectedFr: null, langueI18nCode: null };

  const langueArray = userTradLanguages.filter(
    (langue) => langue._id === langueId
  );
  if (langueArray.length > 0)
    return {
      langueSelectedFr: langueArray[0].langueFr,
      langueI18nCode: langueArray[0].i18nCode,
    };
  return { langueSelectedFr: null, langueI18nCode: null };
};

const UserTranslation = () => {
  const [
    showOneNeedTranslationModal,
    setShowOneNeedTranslationModal,
  ] = useState(false);
  const [showTraducteurModal, setShowTraducteurModal] = useState(false);
  const [showNeedsModal, setShowNeedsModal] = useState(false);
  const [showCompleteProfilModal, setShowCompleteProfilModal] = useState(false);
  const [selectedNeedId, setSelectedNeedId] = useState<ObjectId | null>(null);

  const toggleOneNeedTranslationModal = () =>
    setShowOneNeedTranslationModal(!showOneNeedTranslationModal);

  const toggleNeedsModal = () => setShowNeedsModal(!showNeedsModal);
  const toggleTraducteurModal = () =>
    setShowTraducteurModal(!showTraducteurModal);
  const toggleCompleteProfilModal = () =>
    setShowCompleteProfilModal(!showCompleteProfilModal);
  const [showTutoModal, setShowTutoModal] = useState(false);
  const toggleTutoModal = () => setShowTutoModal(!showTutoModal);

  const [elementToTranslate, setElementToTranslate] = useState(null);

  const [indicators, setIndicators] = useState<null | Indicators>(null);

  //@ts-ignore
  const langueInUrl = useParams()?.id;

  const userTradLanguages = useSelector(userSelectedLanguageSelector);
  const userFirstTradLanguage =
    userTradLanguages.length > 0 ? userTradLanguages[0].i18nCode : null;
  const dispatch = useDispatch();

  const isLoadingDispositifs = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS)
  );

  const user = useSelector(userSelector);
  let history = useHistory();
  const router = useRouter();

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

  const needs = useSelector(needsSelector);

  useEffect(() => {
    window.scrollTo(0, 0);

    const locale = router.locale ? `/${router.locale}` : "";

    if (userFirstTradLanguage && !langueInUrl) {
      return history.push(
        locale + "/backend/user-translation/" + userFirstTradLanguage
      );
    }

    if (langueInUrl && !userFirstTradLanguage) {
      return history.push(locale + "/backend/user-translation");
    }

    if (!availableLanguages.includes(langueInUrl)) {
      return history.push(locale + "/backend/user-translation");
    }
    const loadIndicators = async () => {
      if (user && user.user) {
        try {
          const data = await API.get_progression({
            userId: user.user._id,
          });
          setIndicators(data.data);
        }catch(e) { }
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

  const langueId = getLangueId();
  const { langueSelectedFr, langueI18nCode } = getLangueName(
    langueId,
    userTradLanguages
  );

  const isOneNeedNonTranslated =
    needs.filter((need) => {
      // @ts-ignore
      if (!need[langueI18nCode] || !need[langueI18nCode].text) {
        return true;
      }
      return false;
    }).length > 0;

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          backgroundColor: colors.gray20,
          marginTop: "-95px",
          paddingTop: "100px",
        }}
      >
        <Navigation selected="traductions" />
        <div className={styles.container}>
          <LoadingDispositifsWithTranslationsStatus
            toggleTutoModal={toggleTutoModal}
          />
        </div>
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
          backgroundColor: colors.gray20,
          marginTop: "-95px",
          paddingTop: "100px",
        }}
      >
        <Navigation selected="traductions" />
        <div className={styles.container}>
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
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: colors.gray20,
        marginTop: "-95px",
        paddingTop: "100px",
      }}
    >
      <Navigation selected="traductions" />
      <div className={styles.container}>
        <TranslationsAvancement
          userTradLanguages={userTradLanguages}
          history={history}
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
          toggleNeedsModal={toggleNeedsModal}
          isOneNeedNonTranslated={isOneNeedNonTranslated}
        />
        {showTraducteurModal && (
          <TranslationLanguagesChoiceModal
            show={showTraducteurModal}
            toggle={toggleTraducteurModal}
          />
        )}

        {showNeedsModal && (
          <TranslationNeedsModal
            show={showNeedsModal}
            toggle={toggleNeedsModal}
            toggleOneNeedTranslationModal={toggleOneNeedTranslationModal}
            setSelectedNeedId={setSelectedNeedId}
            langueSelectedFr={langueSelectedFr}
            langueI18nCode={langueI18nCode}
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
            user={user.user}
            type={"traduction"}
            element={elementToTranslate}
            isExpert={user.expertTrad}
            langueId={getLangueId()?.toString()}
          />
        )}
        {showOneNeedTranslationModal && (
          <OneNeedTranslationModal
            show={showOneNeedTranslationModal}
            toggle={toggleOneNeedTranslationModal}
            selectedNeedId={selectedNeedId}
            langueI18nCode={langueInUrl}
          />
        )}
      </div>
    </div>
  );
};

export default UserTranslation;
