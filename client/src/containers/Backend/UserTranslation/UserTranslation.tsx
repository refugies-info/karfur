import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
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
import { TranslationNeedsModal } from "./components/TranslationNeedsModal";
import { OneNeedTranslationModal } from "./components/OneNeedTranslationModal";
import styles from "./UserTranslation.module.scss";
import { activatedLanguages } from "data/activatedLanguages";
import useRouterLocale from "hooks/useRouterLocale";
import { useRouter } from "next/router";
import { useLanguages, useUser } from "hooks";
import { GetProgressionResponse, Id } from "api-types";

const availableLanguages = activatedLanguages.map((l) => l.i18nCode).filter((ln) => ln !== "fr");

interface Props {
  title: string;
}

const UserTranslation = (props: Props) => {
  const { user } = useUser();
  const history = useHistory();
  const dispatch = useDispatch();
  const routerLocale = useRouterLocale();
  const langueInUrl = useParams<{ id: string }>()?.id;
  const { getLanguage, getLanguageByCode, userTradLanguages } = useLanguages();
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

  /**
   * Ce truc semble fait de manière vraiment étrange
   * FIXME
   * @deprecated
   */
  const [elementToTranslate, setElementToTranslate] = useState<any>(null);

  const [indicators, setIndicators] = useState<null | GetProgressionResponse>(null);

  useEffect(() => {
    document.title = props.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const userFirstTradLanguage = userTradLanguages.length > 0 ? userTradLanguages[0] : null;

  const isLoadingUser = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const isLoading = isLoadingDispositifs || isLoadingUser;

  const dispositifsWithTranslations = useSelector(dispositifsWithTranslationsStatusSelector);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (userFirstTradLanguage && !langueInUrl && getLanguage(userFirstTradLanguage)) {
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
          const data = await API.get_progression({});
          setIndicators(data);
        } catch (e) {}
      }
    };

    if (langueInUrl) {
      if (!isLoadingDispositifs) dispatch(fetchDispositifsWithTranslationsStatusActionCreator(langueInUrl));
      loadIndicators();
    }
  }, [langueInUrl, userFirstTradLanguage, isLoadingUser, user]);

  const nbWords = indicators?.totalIndicator?.wordsCount || 0;

  const timeSpent = indicators?.totalIndicator?.timeSpent
    ? Math.floor(indicators.totalIndicator.timeSpent / 1000 / 60)
    : 0;

  const langue = getLanguageByCode(langueInUrl);

  const router = useRouter();
  const completeProfileModalCallback = () => {
    if (!langue || !elementToTranslate) return;
    if (!user.expertTrad && elementToTranslate.tradStatus === "VALIDATED") return;
    return router.push({
      pathname: `/${elementToTranslate.typeContenu || "dispositif"}/${elementToTranslate._id}/translate`,
      search: `?language=${langue._id.toString()}`,
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
          actualLanguage={langue}
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
          toggleNeedsModal={toggleNeedsModal}
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
            langueSelectedFr={langue?.langueFr}
            langueI18nCode={langue?.i18nCode}
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
