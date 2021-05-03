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
  if (!frenchLevelFilter) return contents;
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
export const filterContents = (contents, query) => {
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

  return contentsFilteredByFrenchLevel;
};
