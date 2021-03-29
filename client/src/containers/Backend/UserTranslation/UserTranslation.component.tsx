/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userFirstSelectedLanguageSelector } from "../../../services/User/user.selectors";
import { Props } from "./UserTranslation.container";
import API from "../../../utils/API";
import { fetchDispositifsWithTranslationsStatusActionCreator } from "../../../services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.actions";
import { isLoadingSelector } from "../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../services/LoadingStatus/loadingStatus.actions";
import { dispositifsWithTranslationsStatusSelector } from "../../../services/DispositifsWithTranslationsStatus/dispositifsWithTranslationsStatus.selectors";

export interface PropsBeforeInjection {
  match: any;
  history: any;
}
export const UserTranslationComponent = (props: Props) => {
  const param = props.match.params.id;
  console.log("param", param);

  const userTradLanguage = useSelector(userFirstSelectedLanguageSelector);
  const dispatch = useDispatch();

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_DISPOSITIFS_TRANSLATIONS_STATUS)
  );
  const dispositifsWithTranslations = useSelector(
    dispositifsWithTranslationsStatusSelector
  );

  useEffect(() => {
    console.log("use effect");
    if (userTradLanguage && !param) {
      console.log("userTradLanguage reidrect", userTradLanguage);

      return props.history.push(
        "/backend/user-translation/" + userTradLanguage
      );
    }

    if (param && !userTradLanguage) {
      return props.history.push("/backend/user-translation");
    }

    if (userTradLanguage) {
      dispatch(
        fetchDispositifsWithTranslationsStatusActionCreator(userTradLanguage)
      );
    }
  }, [param, userTradLanguage]);

  if (isLoading) return <div>Loading</div>;

  if (dispositifsWithTranslations.length === 0) {
    return <div>no translations</div>;
  }

  const nbAtrad = dispositifsWithTranslations.filter(
    (trad) => trad.tradStatus === "À traduire"
  ).length;

  const nbPubliées = dispositifsWithTranslations.filter(
    (trad) => trad.tradStatus === "Validée"
  ).length;

  return (
    <div>
      {"Hello " + (param || "no param")}
      <span>{"nb a traduire " + nbAtrad}</span>
      <span>{"nb validee " + nbPubliées}</span>
    </div>
  );
};
