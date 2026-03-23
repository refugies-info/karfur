import { ageFilters, frenchLevelFilter, publicOptions, statusOptions } from "data/searchFilters";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { allLanguesSelector } from "~/services/Langue/langue.selectors";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";

const COUNTS_DISABLED = process.env.NEXT_PUBLIC_DISABLE_SEARCH_COUNTS === "true";

/**
 * Group docs by public status type and count them.
 * When counts are disabled, returns options with count: 0 — no dispositif data needed.
 */
export const useStatusOptions = () => {
  return useMemo(() => {
    return statusOptions.map((option) => ({
      ...option,
      count: 0,
    }));
  }, []);
};

export const usePublicOptions = () => {
  return useMemo(() => {
    return publicOptions.map((option) => ({
      ...option,
      count: 0,
    }));
  }, []);
};

export const useAgeOptions = () => {
  return useMemo(() => {
    return ageFilters.map((option) => ({
      ...option,
      count: 0,
    }));
  }, []);
};

export const useFrenchLevelOptions = () => {
  return useMemo(() => {
    return frenchLevelFilter.map((option) => ({
      ...option,
      count: 0,
    }));
  }, []);
};

export const useLanguagesOptions = () => {
  const { t } = useTranslation();

  const allLangues = useSelector(allLanguesSelector);
  const languages = allLangues.filter((langue) => langue.i18nCode !== "fr");
  const getTranslatedLanguage = useMemo(() => {
    return (langueFr: string) => t(`Languages.${langueFr}`, langueFr) as string;
  }, [t]);

  const languagesOptions = useMemo(() => {
    const sorted = languages.sort((a, b) =>
      getTranslatedLanguage(a.langueFr).localeCompare(getTranslatedLanguage(b.langueFr)),
    );
    return sorted.map((ln) => ({
      key: ln.i18nCode,
      value: getTranslatedLanguage(ln.langueFr),
    }));
  }, [languages, getTranslatedLanguage]);

  return useMemo(() => {
    return languagesOptions.map((option) => ({
      ...option,
      count: 0,
    }));
  }, [languagesOptions]);
};
