import { ageFilters, frenchLevelFilter, publicOptions, statusOptions } from "data/searchFilters";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { searchResultsSelector } from "services/SearchResults/searchResults.selector";

export const useStatusOptions = () => {
  const filteredResult = useSelector(searchResultsSelector);

  return useMemo(() => {
    return statusOptions.map((option) => {
      return {
        ...option,
        count: 112,
      };
    });
  }, []);
};

export const usePublicOptions = () => {
  const filteredResult = useSelector(searchResultsSelector);

  return useMemo(() => {
    return publicOptions.map((option) => {
      return {
        ...option,
        count: 111,
      };
    });
  }, []);
};

export const useAgeOptions = () => {
  const filteredResult = useSelector(searchResultsSelector);

  return useMemo(() => {
    return ageFilters.map((option) => {
      return {
        ...option,
        count: 110,
      };
    });
  }, []);
};

export const useFrenchLevelOptions = () => {
  const filteredResult = useSelector(searchResultsSelector);

  return useMemo(() => {
    return frenchLevelFilter.map((option) => {
      return {
        ...option,
        count: 109,
      };
    });
  }, []);
};

export const useLanguagesOptions = () => {
  const filteredResult = useSelector(searchResultsSelector);

  const { t } = useTranslation();

  const languages = useSelector(allLanguesSelector);
  const getTranslatedLanguage = useMemo(() => {
    return (langueFr: string) => t(`Languages.${langueFr}`, langueFr) as string;
  }, [t]);

  const languagesOptions = useMemo(() => {
    // Sort languages by langueFr
    const sorted = languages.sort((a, b) =>
      getTranslatedLanguage(a.langueFr).localeCompare(getTranslatedLanguage(b.langueFr)),
    );
    return sorted.map((ln) => ({
      key: ln.i18nCode,
      value: getTranslatedLanguage(ln.langueFr),
    }));
  }, [languages, getTranslatedLanguage]);

  return useMemo(() => {
    return languagesOptions.map((option) => {
      return {
        ...option,
        count: 108,
      };
    });
  }, [languagesOptions]);
};
