import { Id, SimpleDispositif } from "@refugies-info/api-types";
import { createSelector } from "reselect";
import { getThemesDisplayed } from "~/lib/recherche/functions";
import { queryDispositifs } from "~/lib/recherche/queryContents";
import { RootState } from "../rootReducer";
import { Results, SearchQuery } from "./searchResults.reducer";

export const searchResultsSelector = (state: RootState): Results => state.searchResults.results;

export const noResultsSelector = (state: RootState): SimpleDispositif[] => state.searchResults.noResults;

export const searchQuerySelector = (state: RootState): SearchQuery => state.searchResults.query;

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
  (themesDisplayed, selectLanguage) => themesDisplayed.map((t) => t.short[selectLanguage] || t.short.fr),
);

const selectActiveDispositifs = (state: RootState) => state.activeDispositifs;

/**
 * Selector that returns a function to compute the filtered dispositifs count
 * when a specific need is selected (in addition to current filters)
 */
export const filteredDispositifsCountByNeedSelector = createSelector(
  [selectActiveDispositifs, selectNeeds, searchQuerySelector],
  (dispositifs, allNeeds, currentQuery) => {
    return (needId: Id): number => {
      // Create a new query with the selected need added
      const queryWithNeed: SearchQuery = {
        ...currentQuery,
        needs: [...currentQuery.needs, needId],
      };
      
      // Filter dispositifs with the new query
      const results = queryDispositifs(queryWithNeed, dispositifs, allNeeds);
      return results.matches.length;
    };
  },
);
