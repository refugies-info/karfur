import { ageFilters, AgeOptions, filterType, frenchLevelFilter, FrenchOptions, sortOptions } from "data/searchFilters";
import { SearchQuery } from "pages/recherche";
import { Theme } from "types/interface";

export const backwardCompatibility = (routerQuery: any, searchQuery: SearchQuery, allThemes: Theme[]): SearchQuery => {
  const { tag, dep, age, niveauFrancais, filter, langue, tri } = routerQuery;

  if (tag) {
    const themeShort = decodeURIComponent(tag as string);
    const themeId = allThemes.find(theme => theme.name.fr === themeShort)?._id;
    if (themeId) searchQuery.themesSelected = [themeId];
  }
  if (age) {
    const newAge = ageFilters.find(a => a.backwardCompatibility.includes(decodeURIComponent(age as string)))?.key;
    if (newAge) searchQuery.filterAge = [newAge as AgeOptions];
  }
  if (niveauFrancais) {
    const newFrenchLevel = frenchLevelFilter.find(a => a.backwardCompatibility.includes(decodeURIComponent(niveauFrancais as string)))?.key;
    if (newFrenchLevel) searchQuery.filterFrenchLevel = [newFrenchLevel as FrenchOptions];
  }
  if (langue) {
    searchQuery.filterLanguage = [decodeURIComponent(langue as string)];
  }
  if (dep) {
    searchQuery.departmentsSelected = [decodeURIComponent(dep as string)];
  }
  if (filter) {
    const newFilterType = filterType.find(a => a.backwardCompatibility === decodeURIComponent(filter as string))?.key
    if (newFilterType) searchQuery.selectedType = newFilterType;
  }
  if (tri) {
    const newSort = sortOptions.find(a => a.backwardCompatibility === decodeURIComponent(tri as string))?.key
    if (newSort) searchQuery.selectedSort = newSort;
  }

  return searchQuery;
}
