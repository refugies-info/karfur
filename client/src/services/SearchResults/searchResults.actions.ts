import { ADD_TO_QUERY, SET_RESULTS } from "./searchResults.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { Results, SearchQuery } from "./searchResults.reducer";

export const setSearchResultsActionCreator = (results: Results) => action(SET_RESULTS, results);
export const addToQueryActionCreator = (query: Partial<SearchQuery>) => action(ADD_TO_QUERY, query);

const actions = { setSearchResultsActionCreator, addToQueryActionCreator };

export type SearchResultsActions = ActionType<typeof actions>;
