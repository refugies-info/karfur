import { ageFilters, frenchLevelFilter, publicOptions, statusOptions } from "data/searchFilters";
import _ from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getMatchingAgeOptions } from "~/lib/recherche/filterContents";
import { filterDispositifs } from "~/lib/recherche/queryContents";
import { FilterKey } from "~/lib/recherche/resultsDisplayRules";
import { activeDispositifsSelector } from "~/services/ActiveDispositifs/activeDispositifs.selector";
import { allLanguesSelector } from "~/services/Langue/langue.selectors";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";

const useDocsToFilter = (skip: FilterKey) => {
  const dispositifs = useSelector(activeDispositifsSelector);
  const query = useSelector(searchQuerySelector);
  const matches = useMemo(() => {
    return filterDispositifs(query, dispositifs, false, skip);
  }, [query, dispositifs, skip]);

  return matches;
};

/**
 * Group docs by public status type and count them.
 * @returns
 */
export const useStatusOptions = () => {
  const docs = useDocsToFilter("status");

  const counts = useMemo(() => {
    return _(docs)
      .flatMap((doc) => doc.metadatas?.publicStatus || [])
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
  const docs = useDocsToFilter("public");

  const counts = useMemo(() => {
    return _(docs)
      .flatMap((doc) => doc.metadatas?.public || [])
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
  const docs = useDocsToFilter("age");

  const counts = useMemo(() => {
    return _(docs)
      .flatMap((doc) => getMatchingAgeOptions(doc))
      .countBy()
      .value();
  }, [docs]);

  return useMemo(() => {
    return ageFilters.map((option) => {
      return {
        ...option,
        count: counts[option.key] || 0,
      };
    });
  }, [counts]);
};

export const useFrenchLevelOptions = () => {
  const docs = useDocsToFilter("frenchLevel");

  const counts = useMemo(() => {
    return _(docs)
      .map((doc) => {
        return doc.metadatas?.frenchLevel || [];
      })
      .map((frenchLevel) => {
        return _(frenchLevel)
          .map((level) => {
            switch (level) {
              case "alpha":
              case "A1":
              case "A2":
                return "a";
              case "B1":
              case "B2":
                return "b";
              case "C1":
              case "C2":
                return "c";
              default:
                return null;
            }
          })
          .filter((x) => x !== null)
          .uniq()
          .value();
      })
      .map((x) => (x.length === 0 ? ["a", "b", "c"] : x))
      .flatten()
      .countBy()
      .value();
  }, [docs]);

  return useMemo(() => {
    return frenchLevelFilter.map((option) => {
      return {
        ...option,
        count: counts[option.key] || 0,
      };
    });
  }, [counts]);
};

export const useLanguagesOptions = () => {
  const docs = useDocsToFilter("language");

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

  const counts = useMemo(() => {
    return _(docs)
      .flatMap((doc) => doc.availableLanguages || [])
      .countBy()
      .value();
  }, [docs]);

  return useMemo(() => {
    return languagesOptions.map((option) => {
      return {
        ...option,
        count: counts[option.key] || 0,
      };
    });
  }, [languagesOptions, counts]);
};
