import { SearchQuery } from "services/SearchResults/searchResults.reducer";

export const isHomeSearchVisible = (query: SearchQuery) => {
  const hideHomeSearch = query.search ||
    query.needs.length ||
    query.themes.length ||
    query.departments.length ||
    query.age.length ||
    query.frenchLevel.length ||
    query.language.length ||
    query.sort !== "date" ||
    query.type !== "all";
  return !hideHomeSearch;
}
