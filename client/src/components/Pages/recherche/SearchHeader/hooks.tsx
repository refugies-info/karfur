import { ageFilters, frenchLevelFilter, publicOptions, statusOptions } from "data/searchFilters";
import _ from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { searchResultsSelector } from "services/SearchResults/searchResults.selector";

const useFilteredDocs = () => {
  const { demarches, dispositifs } = useSelector(searchResultsSelector);

  return useMemo(() => {
    return [...demarches, ...dispositifs];
  }, [demarches, dispositifs]);
};
/**
 * Group docs by public status type and count them.
 * @returns
 */
export const useStatusOptions = () => {
  const docs = useFilteredDocs();

  const counts = useMemo(() => {
    return _(docs)
      .flatMap((doc) => doc.metadatas.publicStatus || [])
      .countBy()
      .value();
  }, [docs]);

  return useMemo(() => {
    return statusOptions.map((option) => {
      return {
        ...option,
        count: counts[option.key] || 0,
      };
    });
  }, [counts]);
};

export const usePublicOptions = () => {
  const docs = useFilteredDocs();

  const counts = useMemo(() => {
    return _(docs)
      .flatMap((doc) => doc.metadatas.public || [])
      .countBy()
      .value();
  }, [docs]);

  return useMemo(() => {
    return publicOptions.map((option) => {
      return {
        ...option,
        count: counts[option.key] || 0,
      };
    });
  }, [counts]);
};

export const useAgeOptions = () => {
  const docs = useFilteredDocs();

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
  const docs = useFilteredDocs();

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
  const docs = useFilteredDocs();

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
