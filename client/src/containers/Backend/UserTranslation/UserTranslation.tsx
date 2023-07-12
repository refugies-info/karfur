import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useRouter } from "next/router";
import { useLanguages, useUser, useRouterLocale } from "hooks";
import { GetProgressionResponse, Id, Languages } from "@refugies-info/api-types";
import API from "utils/API";
import { activatedLanguages } from "data/activatedLanguages";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { dispositifsWithTranslationsStatusSelector } from "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.selectors";
import { needsSelector } from "services/Needs/needs.selectors";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import { LoadingDispositifsWithTranslationsStatus } from "./components/LoadingDispositifsWithTranslationsStatus";
import { StartTranslating } from "./components/StartTranslating";
import { TranslationsAvancement, OneNeedTranslationModal, TranslationLanguagesChoiceModal } from "./components";
import { FrameModal } from "components/Modals";
import { CompleteProfilModal } from "components/Modals/CompleteProfilModal/CompleteProfilModal";
import styles from "./UserTranslation.module.scss";

const availableLanguages = activatedLanguages.map((l) => l.i18nCode).filter((ln) => ln !== "fr");

interface Props {
  title: string;
}

const UserTranslation = (props: Props) => {
  const { user } = useUser();
  const history = useHistory();
  const dispatch = useDispatch();
  const routerLocale = useRouterLocale();
  const langueInUrl = useParams<{ id: string }>()?.id as Languages;
  const { getLanguage, getLanguageByCode, userTradLanguages } = useLanguages();
  const isLoadingDispositifs = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS));

  const [showTraducteurModal, setShowTraducteurModal] = useState(false);
  const [showCompleteProfilModal, setShowCompleteProfilModal] = useState(false);
  const [selectedNeedId, setSelectedNeedId] = useState<Id | null>(null);

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
  }, [props.title]);

  const userFirstTradLanguage = userTradLanguages.length > 0 ? userTradLanguages[0] : null;
  const isLoadingUser = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const isLoadingNeeds = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_NEEDS));
  const isLoading = isLoadingDispositifs || isLoadingUser;
  const dispositifsWithTranslations = useSelector(dispositifsWithTranslationsStatusSelector);
  const needs = useSelector(needsSelector);

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
      if (!isLoadingDispositifs && dispositifsWithTranslations.length === 0)
        dispatch(fetchDispositifsWithTranslationsStatusActionCreator(langueInUrl));
      if (!isLoadingNeeds && needs.length === 0) dispatch(fetchNeedsActionCreator());
      loadIndicators();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    langueInUrl,
    userFirstTradLanguage,
    isLoadingUser,
    user,
    dispositifsWithTranslations,
    isLoadingDispositifs,
    isLoadingNeeds,
    needs,
  ]);

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

  const nbNeedsToTranslate = needs.filter((need) => langue && !need[langue.i18nCode as Languages]?.text).length;

  if (isLoading)
    return (
      <div className={styles.main}>
        <div className={styles.container}>
          <LoadingDispositifsWithTranslationsStatus toggleTutoModal={toggleTutoModal} />
        </div>
      </div>
    );

  if (dispositifsWithTranslations.length === 0 || userTradLanguages.length === 0) {
    return (
      <div className={styles.main}>
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
    <div className={styles.main}>
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
          nbNeedsToTranslate={nbNeedsToTranslate}
          setSelectedNeedId={setSelectedNeedId}
        />

        {showTraducteurModal && (
          <TranslationLanguagesChoiceModal show={showTraducteurModal} toggle={toggleTraducteurModal} />
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
        {selectedNeedId && (
          <OneNeedTranslationModal
            show={!!selectedNeedId}
            toggle={() => setSelectedNeedId(null)}
            selectedNeedId={selectedNeedId}
            langueI18nCode={langueInUrl}
            countryCode={langue?.langueCode}
          />
        )}
      </div>
    </div>
  );
};

export default UserTranslation;
