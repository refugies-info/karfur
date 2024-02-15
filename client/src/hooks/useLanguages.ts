import { GetLanguagesResponse, Id } from "@refugies-info/api-types";
import keyBy from "lodash/keyBy";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { userSelectedLanguageSelector } from "services/User/user.selectors";

const useLanguages = () => {
  const router = useRouter();
  const langues = useSelector(allLanguesSelector);
  const userTradLanguages = useSelector(userSelectedLanguageSelector);
  const languageById = useMemo(() => keyBy(langues, (langue) => langue._id), [langues]);
  const getLanguage = useCallback((id: Id): GetLanguagesResponse => languageById[id.toString()] as GetLanguagesResponse, [languageById]);
  const getLanguageByCode = (code: string): GetLanguagesResponse | undefined =>
    langues.find((langue) => langue.i18nCode === code) as GetLanguagesResponse;

  const currentLocale = getLanguageByCode(router.locale || "fr");

  return { currentLocale, langues, getLanguage, getLanguageByCode, userTradLanguages };
};

export default useLanguages;
