import { GetDispositifsResponse } from "@refugies-info/api-types";
import { getThemesDisplayed } from "~/lib/recherche/functions";
import { RootState } from "../rootReducer";
import { Results, SearchQuery } from "./searchResults.reducer";

export const searchResultsSelector = (state: RootState): Results => state.searchResults.results;

export const noResultsSelector = (state: RootState): GetDispositifsResponse[] => state.searchResults.noResults;

export const searchQuerySelector = (state: RootState): SearchQuery => state.searchResults.query;

export const themesDisplayedSelector = (state: RootState) => {
  return getThemesDisplayed(
    state.themes.activeThemes,
    state.needs,
    state.searchResults.query.themes,
    state.searchResults.query.needs,
  );
};

export const themesDisplayedValueSelector = (state: RootState) => {
  const themesDisplayed = getThemesDisplayed(
    state.themes.activeThemes,
    state.needs,
    state.searchResults.query.themes,
    state.searchResults.query.needs,
  );
  return themesDisplayed.map((t) => t.short[state.langue.languei18nCode] || t.short.fr);
};
