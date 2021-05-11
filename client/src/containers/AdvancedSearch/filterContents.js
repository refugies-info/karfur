import { filtres_contenu } from "./data";

const filterContentsByTheme = (contents, tagFilter) => {
  if (!tagFilter) {
    return contents;
  }

  return contents.filter((content) => {
    if (content.tags && content.tags.length > 0) {
      const hasContentTheme =
        content.tags.filter((tag) => tag && tag.name === tagFilter).length > 0;
      return hasContentTheme;
    }
    return false;
  });
};

const filterContentsByAge = (
  contents,
  ageBottomValueFilter,
  ageTopValueFilter
) => {
  if (!ageBottomValueFilter || !ageTopValueFilter) {
    return contents;
  }

  return contents.filter((content) => {
    if (content.audienceAge && content.audienceAge.length > 0) {
      const ageFilter = content.audienceAge[0];

      if (!ageFilter.bottomValue || !ageFilter.topValue) return true;
      if (
        ageFilter.bottomValue <= ageBottomValueFilter &&
        ageFilter.topValue >= ageTopValueFilter
      ) {
        return true;
      }
      return false;
    }
    return true;
  });
};

const filterContentsByFrenchLevel = (contents, frenchLevelFilter) => {
  if (!frenchLevelFilter || frenchLevelFilter === "bien") return contents;
  const levelsNotAccepted = frenchLevelFilter["$nin"];

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

const filterContentsByType = (contents, typeContenuFilter) => {
  if (!typeContenuFilter) return contents;

  const isDemarcheSelected = typeContenuFilter === filtres_contenu[1].query;
  const isDispositifSelected = typeContenuFilter === filtres_contenu[0].query;

  if (isDemarcheSelected) {
    return contents.filter((content) => content.typeContenu === "demarche");
  }

  if (isDispositifSelected) {
    return contents.filter((content) => content.typeContenu === "dispositif");
  }

  return contents;
};
export const filterContents = (contents, query, filter) => {
  if (!query) return contents;
  const tagFilter = query["tags.name"];
  const contentsFilteredByTheme = filterContentsByTheme(contents, tagFilter);
  const ageBottomValueFilter = query["audienceAge.bottomValue"]
    ? query["audienceAge.bottomValue"]["$lte"]
    : null;
  const ageTopValueFilter = query["audienceAge.topValue"]
    ? query["audienceAge.topValue"]["$gte"]
    : null;

  const contentsFilteredByAge = filterContentsByAge(
    contentsFilteredByTheme,
    ageBottomValueFilter,
    ageTopValueFilter
  );

  const frenchLevelFilter = query["niveauFrancais"];

  const contentsFilteredByFrenchLevel = filterContentsByFrenchLevel(
    contentsFilteredByAge,
    frenchLevelFilter
  );

  const contentsFilterByType = filterContentsByType(
    contentsFilteredByFrenchLevel,
    filter
  );

  return contentsFilterByType;
};
