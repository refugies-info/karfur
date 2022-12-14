import { RootState } from "../rootReducer";
import { getThemesDisplayed } from "lib/recherche/functions";
import { InputFocused, Results, SearchQuery } from "./searchResults.reducer";

export const searchResultsSelector = (state: RootState): Results =>
  state.searchResults.results;

export const searchQuerySelector = (state: RootState): SearchQuery =>
  state.searchResults.query;

export const inputFocusedSelector = (state: RootState): InputFocused =>
  state.searchResults.inputFocused;

export const themesDisplayedSelector = (state: RootState) => {
  return getThemesDisplayed(
    state.themes.activeThemes,
    state.needs,
    state.searchResults.query.themes,
    state.searchResults.query.needs
  )
}

export const themesDisplayedValueSelector = (state: RootState) => {
  const themesDisplayed = getThemesDisplayed(
    state.themes.activeThemes,
    state.needs,
    state.searchResults.query.themes,
    state.searchResults.query.needs
  )
  return themesDisplayed.map((t) => t.short[state.langue.languei18nCode] || t.short.fr).join(", ")
}
