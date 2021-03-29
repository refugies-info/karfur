/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userSelectedLanguageSelector } from "../../../services/User/user.selectors";
import { Props } from "./UserTranslation.container";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "../../../services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { dispositifsWithTranslationsStatusSelector } from "../../../services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.selectors";
import { LoadingDispositifsWithTranlastionsStatus } from "./components/LoadingDispositifsWithTranlastionsStatus";
import { StartTranslating } from "./components/StartTranslating";
import { TranslationsAvancement } from "./components/TranslationsAvancement";

export interface PropsBeforeInjection {
  match: any;
  history: any;
}
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

    if (userFirstTradLanguage) {
      dispatch(
        fetchDispositifsWithTranslationsStatusActionCreator(
          userFirstTradLanguage
        )
      );
    }
  }, [langueInUrl, userFirstTradLanguage, isLoadingUser]);

  if (isLoading) return <LoadingDispositifsWithTranlastionsStatus />;

  if (
    dispositifsWithTranslations.length === 0 ||
    userTradLanguages.length === 0
  ) {
    return <StartTranslating />;
  }

  const nbAtrad = dispositifsWithTranslations.filter(
    (trad) => trad.tradStatus === "À traduire"
  ).length;

  const nbPubliées = dispositifsWithTranslations.filter(
    (trad) => trad.tradStatus === "Validée"
  ).length;

  return (
    <TranslationsAvancement
      userTradLanguages={userTradLanguages}
      history={props.history}
      actualLanguage={langueInUrl}
    />
  );
};
