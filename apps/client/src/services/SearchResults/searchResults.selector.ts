import type { SimpleDispositif } from "@refugies-info/api-types";
import { createSelector } from "reselect";
import { getThemesDisplayed } from "~/lib/recherche/functions";
import type { RootState } from "../rootReducer";
import type { PaginationState, Results, SearchQuery } from "./searchResults.reducer";

export const searchResultsSelector = (state: RootState): Results => state.searchResults.results;

export const noResultsSelector = (state: RootState): SimpleDispositif[] =>
  state.searchResults.noResults;

export const searchQuerySelector = (state: RootState): SearchQuery => state.searchResults.query;

export const searchPaginationSelector = (state: RootState): PaginationState =>
  state.searchResults.pagination;

export const searchLoadingSelector = (state: RootState): boolean => state.searchResults.loading;

const selectActiveThemes = (state: RootState) => state.themes.activeThemes;
const selectNeeds = (state: RootState) => state.needs;
const selectQueryThemes = (state: RootState) => state.searchResults.query.themes;
const selectQueryNeeds = (state: RootState) => state.searchResults.query.needs;
const selectLanguage = (state: RootState) => state.langue.languei18nCode;

export const themesDisplayedSelector = createSelector(
  [selectActiveThemes, selectNeeds, selectQueryThemes, selectQueryNeeds],
  (selectActiveThemes, selectNeeds, selectQueryThemes, selectQueryNeeds) =>
    getThemesDisplayed(selectActiveThemes, selectNeeds, selectQueryThemes, selectQueryNeeds),
);

export const themesDisplayedValueSelector = createSelector(
  [themesDisplayedSelector, selectLanguage],
  (themesDisplayed, selectLanguage) =>
    themesDisplayed.map((t) => t.short[selectLanguage] || t.short.fr),
);
