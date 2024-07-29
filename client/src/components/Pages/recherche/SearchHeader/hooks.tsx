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
  const docs = useFilteredDocs();

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
  const docs = useFilteredDocs();

  const counts = useMemo(() => {
    return _(docs)
      .map((doc) => {
        switch (doc.metadatas?.age?.type) {
          case "lessThan":
            return Array.isArray(doc.metadatas?.age?.ages) && doc.metadatas?.age?.ages.length > 0
              ? [0, doc.metadatas?.age?.ages[0]]
              : null;
          case "moreThan":
            return Array.isArray(doc.metadatas?.age?.ages) && doc.metadatas?.age?.ages.length > 0
              ? [doc.metadatas?.age?.ages[0], Number.MAX_SAFE_INTEGER]
              : null;
          case "between":
            return Array.isArray(doc.metadatas?.age?.ages) && doc.metadatas?.age?.ages.length > 1
              ? [doc.metadatas?.age?.ages[0], doc.metadatas?.age?.ages[1]]
              : null;
          default:
            return [0, Number.MAX_SAFE_INTEGER];
        }
      })
      .filter((x) => x !== null)
      .map(([min, max]) => {
        if (min < 18 && max < 18) {
          return "-18";
        }
        if (min >= 18 && max <= 25) {
          return "18-25";
        }
        return "+25";
      })
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
  const docs = useFilteredDocs();

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
