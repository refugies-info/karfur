import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useRouter } from "next/router";
import { useLanguages, useUser, useRouterLocale } from "hooks";
import {
  GetDispositifsWithTranslationAvancementResponse,
  GetProgressionResponse,
  Id,
  Languages,
} from "@refugies-info/api-types";
import API from "utils/API";
import { activatedLanguages } from "data/activatedLanguages";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { dispositifsWithTranslationsStatusSelector } from "services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.selectors";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import { LoadingDispositifsWithTranslationsStatus } from "./components/LoadingDispositifsWithTranslationsStatus";
import { StartTranslating } from "./components/StartTranslating";
import { TranslationsAvancement, OneNeedTranslationModal, TranslationLanguagesChoiceModal } from "./components";
import { FrameModal } from "components/Modals";
import { PseudoModal, pseudoModal } from "components/Modals/PseudoModal";
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
  const [languageLoaded, setLanguageLoaded] = useState<string | null>(null);
  const { getLanguage, getLanguageByCode, userTradLanguages } = useLanguages();
  const isLoadingDispositifs = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS));

  const [showTraducteurModal, setShowTraducteurModal] = useState(false);
  const [selectedNeedId, setSelectedNeedId] = useState<Id | null>(null);

  const toggleTraducteurModal = () => {
    if (!user) return;
    if (!user.user?.username) {
      pseudoModal.open();
    } else {
      setShowTraducteurModal(!showTraducteurModal);
    }
  };
  const [showTutoModal, setShowTutoModal] = useState(false);
  const toggleTutoModal = () => setShowTutoModal(!showTutoModal);
  const [indicators, setIndicators] = useState<null | GetProgressionResponse>(null);

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  const userFirstTradLanguage = useMemo(
    () => (userTradLanguages.length > 0 ? userTradLanguages[0] : null),
    [userTradLanguages],
  );
  const isLoadingUser = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const isLoadingNeeds = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_NEEDS));
  const isLoading = isLoadingDispositifs || isLoadingUser;
  const dispositifsWithTranslations = useSelector(dispositifsWithTranslationsStatusSelector);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userFirstTradLanguage && !langueInUrl && getLanguage(userFirstTradLanguage)) {
      return history.replace(routerLocale + "/backend/user-translation/" + getLanguage(userFirstTradLanguage).i18nCode);
    } else if ((langueInUrl && !userFirstTradLanguage) || !availableLanguages.includes(langueInUrl)) {
      return history.replace(routerLocale + "/backend/user-translation");
    }

    const loadIndicators = async () => {
      if (user?.user) {
        try {
          const data = await API.get_progression({ onlyTotal: true });
          setIndicators(data);
        } catch (e) {}
      }
    };
    if (langueInUrl && languageLoaded !== langueInUrl) {
      setLanguageLoaded(langueInUrl);
      if (!isLoadingDispositifs) dispatch(fetchDispositifsWithTranslationsStatusActionCreator(langueInUrl));
      if (!isLoadingNeeds) dispatch(fetchNeedsActionCreator());
      loadIndicators();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    langueInUrl,
    userFirstTradLanguage,
    getLanguage,
    user,
    languageLoaded,
    isLoadingDispositifs,
    isLoadingNeeds,
    dispatch,
  ]);

  const nbWords = indicators?.totalIndicator?.wordsCount || 0;
  const timeSpent = indicators?.totalIndicator?.timeSpent
    ? Math.floor(indicators.totalIndicator.timeSpent / 1000 / 60)
    : 0;

  const langue = getLanguageByCode(langueInUrl);

  if (isLoading)
    return (
      <div className={styles.main}>
        <div className={styles.container}>
          <LoadingDispositifsWithTranslationsStatus toggleTutoModal={toggleTutoModal} />
        </div>
      </div>
    );

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        {dispositifsWithTranslations.length === 0 || userTradLanguages.length === 0 ? (
          <StartTranslating toggleTraducteurModal={toggleTraducteurModal} toggleTutoModal={toggleTutoModal} />
        ) : (
          <>
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
              user={user.user}
              setSelectedNeedId={setSelectedNeedId}
            />

            {selectedNeedId && (
              <OneNeedTranslationModal
                show={!!selectedNeedId}
                toggle={() => setSelectedNeedId(null)}
                selectedNeedId={selectedNeedId}
                langueI18nCode={langueInUrl}
                countryCode={langue?.langueCode}
              />
            )}
          </>
        )}

        {showTraducteurModal && (
          <TranslationLanguagesChoiceModal show={showTraducteurModal} toggle={toggleTraducteurModal} />
        )}
        {showTutoModal && <FrameModal show={showTutoModal} toggle={toggleTutoModal} section={"Traduction"} />}
        <PseudoModal successCallback={() => setShowTraducteurModal(true)} />
      </div>
    </div>
  );
};

export default UserTranslation;
