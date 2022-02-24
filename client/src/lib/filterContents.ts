import { searchFrench, FrenchLevelFilter, AgeFilter, searchAge } from "data/searchFilters";
import { SearchQuery } from "pages/advanced-search";
import { IDispositif } from "types/interface";

const filterContentsByTheme = (contents: IDispositif[], tagFilter: string | undefined) => {
  if (!tagFilter) return contents;

  return contents.filter((content) => {
    if (content.tags && content.tags.length > 0) {
      const hasContentTheme = content.tags.filter((tag) => tag && tag.name === tagFilter).length > 0;
      return hasContentTheme;
    }
    return false;
  });
};

const filterContentsByAge = (
  contents: IDispositif[],
  age: string | undefined,
) => {
  if (!age || !searchAge.children) return contents;

  const currentAgeFilter = (searchAge.children as AgeFilter[]).find(
    (filter: AgeFilter) => filter.name === age
  );
  if (!currentAgeFilter || !currentAgeFilter.bottomValue || !currentAgeFilter.topValue) {
    return contents;
  }

  return contents.filter((content) => {
    if (content.audienceAge && content.audienceAge.length > 0) {
      const ageFilter = content.audienceAge[0];

      if (!ageFilter.bottomValue || !ageFilter.topValue) return true;
      if (
        ageFilter.bottomValue <= currentAgeFilter.bottomValue &&
        ageFilter.topValue >= currentAgeFilter.topValue
      ) {
        return true;
      }
      return false;
    }
    return true;
  });
};

const filterContentsByFrenchLevel = (contents: IDispositif[], frenchLevelFilter: string | undefined) => {
  if (!frenchLevelFilter || frenchLevelFilter === "bien" || !searchFrench.children) return contents;

  const levelsNotAccepted = (searchFrench.children as FrenchLevelFilter[]).find(
    (filter: FrenchLevelFilter) => filter.name === frenchLevelFilter
  )?.query || [];

  return contents.filter((content) => {
    if (
      content.niveauFrancais &&
      levelsNotAccepted.includes(content.niveauFrancais[0])
    ) {
      return false;
    }
    return true;
  });
};

const filterContentsByType = (contents: IDispositif[], typeContenuFilter: "dispositifs" | "demarches" | undefined) => {
  if (!typeContenuFilter) return contents;

  if (typeContenuFilter === "demarches") {
    return contents.filter((content) => content.typeContenu === "demarche");
  }

  if (typeContenuFilter === "dispositifs") {
    return contents.filter((content) => content.typeContenu === "dispositif");
  }

  return contents;
};

export const filterContents = (contents: IDispositif[], query: SearchQuery) => {
  if (!query) return contents;
  const contentsFilteredByTheme = filterContentsByTheme(contents, query.theme);
  const contentsFilteredByAge = filterContentsByAge(
    contentsFilteredByTheme,
    query.age
  );
  const contentsFilteredByFrenchLevel = filterContentsByFrenchLevel(
    contentsFilteredByAge,
    query.frenchLevel
  );
  const contentsFilterByType = filterContentsByType(
    contentsFilteredByFrenchLevel,
    query.type
  );

  return contentsFilterByType;
};
