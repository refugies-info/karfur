import type { GetThemeResponse } from "@refugies-info/api-types";
import {
  type AgeOptions,
  ageFilters,
  type FrenchOptions,
  filterType,
  frenchLevelFilter,
  sortOptions,
} from "data/searchFilters";
import type { SearchQuery } from "~/services/SearchResults/searchResults.reducer";
import { asString } from "./queryParam";

export const backwardCompatibility = (
  routerQuery: any,
  searchQuery: SearchQuery,
  allThemes: GetThemeResponse[],
): SearchQuery => {
  const { tag, dep, age, niveauFrancais, filter, langue, tri } = routerQuery;

  if (tag) {
    const themeShort = asString(tag);
    const themeId = allThemes.find((theme) => theme.name.fr === themeShort)?._id;
    if (themeId) searchQuery.themes = [themeId];
  }
  if (age) {
    const newAge = ageFilters.find((a) => a.backwardCompatibility.includes(asString(age)))?.key;
    if (newAge) searchQuery.age = [newAge as AgeOptions];
  }
  if (niveauFrancais) {
    const newFrenchLevel = frenchLevelFilter.find((a) =>
      a.backwardCompatibility.includes(asString(niveauFrancais)),
    )?.key;
    if (newFrenchLevel) searchQuery.frenchLevel = [newFrenchLevel as FrenchOptions];
  }
  if (langue) {
    searchQuery.language = [asString(langue)];
  }
  if (dep) {
    searchQuery.departments = [asString(dep)];
  }
  if (filter) {
    const newFilterType = filterType.find((a) => a.backwardCompatibility === asString(filter))?.key;
    if (newFilterType) searchQuery.type = newFilterType;
  }
  if (tri) {
    const newSort = sortOptions.find((a) => a.backwardCompatibility === asString(tri))?.key;
    if (newSort) searchQuery.sort = newSort;
  }

  return searchQuery;
};
