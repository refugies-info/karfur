import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { userSelector } from "services/User/user.selectors";
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
import { Indicators } from "types/interface";
import { TranslationNeedsModal } from "./components/TranslationNeedsModal";
import { OneNeedTranslationModal } from "./components/OneNeedTranslationModal";
import { needsSelector } from "services/Needs/needs.selectors";
import styles from "./UserTranslation.module.scss";
import { activatedLanguages } from "data/activatedLanguages";
import useRouterLocale from "hooks/useRouterLocale";
import { useRouter } from "next/router";
import { useLanguages } from "hooks";
import { Id } from "api-types";

const availableLanguages = activatedLanguages.map((l) => l.i18nCode).filter((ln) => ln !== "fr");

interface Props {
  title: string;
}

const UserTranslation = (props: Props) => {
  const dispatch = useDispatch();
  const langueInUrl = useParams<{ id: string }>()?.id;
  const { getLanguage, userTradLanguages } = useLanguages();
  const isLoadingDispositifs = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS));

  const [showOneNeedTranslationModal, setShowOneNeedTranslationModal] = useState(false);
  const [showTraducteurModal, setShowTraducteurModal] = useState(false);
  const [showNeedsModal, setShowNeedsModal] = useState(false);
  const [showCompleteProfilModal, setShowCompleteProfilModal] = useState(false);
  const [selectedNeedId, setSelectedNeedId] = useState<Id | null>(null);

  const toggleOneNeedTranslationModal = () => setShowOneNeedTranslationModal(!showOneNeedTranslationModal);

  const toggleNeedsModal = () => setShowNeedsModal(!showNeedsModal);
  const toggleTraducteurModal = () => setShowTraducteurModal(!showTraducteurModal);
  const toggleCompleteProfilModal = () => setShowCompleteProfilModal(!showCompleteProfilModal);
  const [showTutoModal, setShowTutoModal] = useState(false);
  const toggleTutoModal = () => setShowTutoModal(!showTutoModal);

  const [elementToTranslate, setElementToTranslate] = useState<any>(null);

  const [indicators, setIndicators] = useState<null | Indicators>(null);

  useEffect(() => {
    document.title = props.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLangueName = useCallback(
    (langueId: Id | null, userTradLanguages: Id[]) => {
      if (!langueId) return { langueSelectedFr: null, langueI18nCode: null };

      const langue = userTradLanguages.find((langue) => langue === langueId);
      if (langue) {
        const language = getLanguage(langue);
        return {
          langueSelectedFr: language.langueFr,
          langueI18nCode: language.i18nCode,
        };
      }
      return { langueSelectedFr: null, langueI18nCode: null };
    },
    [getLanguage],
  );

  const userFirstTradLanguage = userTradLanguages.length > 0 ? userTradLanguages[0] : null;

  const user = useSelector(userSelector);
  let history = useHistory();
  const routerLocale = useRouterLocale();

  const isLoadingUser = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const isLoading = isLoadingDispositifs || isLoadingUser;

  const dispositifsWithTranslations = useSelector(dispositifsWithTranslationsStatusSelector);

  const getLangueId = () => {
    if (!userTradLanguages || userTradLanguages.length === 0) return null;
    const langue = userTradLanguages.find((langue) => getLanguage(langue).i18nCode === langueInUrl);
    return langue || null;
  };

  const needs = useSelector(needsSelector);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (userFirstTradLanguage && !langueInUrl) {
      return history.push(routerLocale + "/backend/user-translation/" + getLanguage(userFirstTradLanguage).i18nCode);
    }

    if (langueInUrl && !userFirstTradLanguage) {
      return history.push(routerLocale + "/backend/user-translation");
    }

    if (!availableLanguages.includes(langueInUrl)) {
      return history.push(routerLocale + "/backend/user-translation");
    }
    const loadIndicators = async () => {
      if (user && user.user) {
        try {
          const data = await API.get_progression({
            userId: user.user._id,
          });
          setIndicators(data.data);
        } catch (e) {}
      }
    };

    if (langueInUrl) {
      if (!isLoadingDispositifs) dispatch(fetchDispositifsWithTranslationsStatusActionCreator(langueInUrl));
      loadIndicators();
    }
  }, [langueInUrl, userFirstTradLanguage, isLoadingUser, user]);

  const nbWords =
    indicators && indicators.totalIndicator && indicators.totalIndicator[0] && indicators.totalIndicator[0].wordsCount
      ? indicators.totalIndicator[0].wordsCount
      : 0;

  const timeSpent =
    indicators && indicators.totalIndicator && indicators.totalIndicator[0] && indicators.totalIndicator[0].timeSpent
      ? Math.floor(indicators.totalIndicator[0].timeSpent / 1000 / 60)
      : 0;

  const langueId = getLangueId();
  const { langueSelectedFr, langueI18nCode } = getLangueName(langueId, userTradLanguages);

  const isOneNeedNonTranslated =
    needs.filter((need) => {
      // @ts-ignore FIXME
      if (langueI18nCode !== null && (!need[langueI18nCode] || !need[langueI18nCode].text)) {
        return true;
      }
      return false;
    }).length > 0;

  const router = useRouter();
  const completeProfileModalCallback = () => {
    const langueId = getLangueId()?.toString();
    if (!langueId || !elementToTranslate) return;
    if (!user.expertTrad && elementToTranslate.tradStatus === "Validée") return;
    return router.push({
      pathname:
        "/backend" +
        (user.expertTrad ? "/validation" : "/traduction") +
        "/" +
        (elementToTranslate.typeContenu || "dispositif"),
      search: `?language=${langueId}&dispositif=${elementToTranslate._id}`,
    });
  };

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
        <div className={styles.container}>
          <LoadingDispositifsWithTranslationsStatus toggleTutoModal={toggleTutoModal} />
        </div>
      </div>
    );

  if (dispositifsWithTranslations.length === 0 || userTradLanguages.length === 0) {
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
        <div className={styles.container}>
          <StartTranslating toggleTraducteurModal={toggleTraducteurModal} toggleTutoModal={toggleTutoModal} />
          {showTraducteurModal && (
            <TranslationLanguagesChoiceModal show={showTraducteurModal} toggle={toggleTraducteurModal} />
          )}
          {showTutoModal && <FrameModal show={showTutoModal} toggle={toggleTutoModal} section={"Traduction"} />}
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
      <div className={styles.container}>
        <TranslationsAvancement
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
          <TranslationLanguagesChoiceModal show={showTraducteurModal} toggle={toggleTraducteurModal} />
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
        {showTutoModal && <FrameModal show={showTutoModal} toggle={toggleTutoModal} section={"Traduction"} />}
        {showCompleteProfilModal && (
          <CompleteProfilModal
            show={showCompleteProfilModal}
            toggle={toggleCompleteProfilModal}
            user={user.user}
            onComplete={completeProfileModalCallback}
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
