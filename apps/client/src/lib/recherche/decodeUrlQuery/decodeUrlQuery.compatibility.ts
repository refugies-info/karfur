import { GetThemeResponse } from "@refugies-info/api-types";
import { ageFilters, AgeOptions, filterType, frenchLevelFilter, FrenchOptions, sortOptions } from "data/searchFilters";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";

export const backwardCompatibility = (routerQuery: any, searchQuery: SearchQuery, allThemes: GetThemeResponse[]): SearchQuery => {
  const { tag, dep, age, niveauFrancais, filter, langue, tri } = routerQuery;

  if (tag) {
    const themeShort = decodeURIComponent(tag as string);
    const themeId = allThemes.find(theme => theme.name.fr === themeShort)?._id;
    if (themeId) searchQuery.themes = [themeId];
  }
  if (age) {
    const newAge = ageFilters.find(a => a.backwardCompatibility.includes(decodeURIComponent(age as string)))?.key;
    if (newAge) searchQuery.age = [newAge as AgeOptions];
  }
  if (niveauFrancais) {
    const newFrenchLevel = frenchLevelFilter.find(a => a.backwardCompatibility.includes(decodeURIComponent(niveauFrancais as string)))?.key;
    if (newFrenchLevel) searchQuery.frenchLevel = [newFrenchLevel as FrenchOptions];
  }
  if (langue) {
    searchQuery.language = [decodeURIComponent(langue as string)];
  }
  if (dep) {
    searchQuery.departments = [decodeURIComponent(dep as string)];
  }
  if (filter) {
    const newFilterType = filterType.find(a => a.backwardCompatibility === decodeURIComponent(filter as string))?.key
    if (newFilterType) searchQuery.type = newFilterType;
  }
  if (tri) {
    const newSort = sortOptions.find(a => a.backwardCompatibility === decodeURIComponent(tri as string))?.key
    if (newSort) searchQuery.sort = newSort;
  }

  return searchQuery;
}
