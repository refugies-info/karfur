import { ADD_TO_QUERY, SET_INPUT_FOCUSED, SET_RESULTS } from "./searchResults.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { InputFocused, Results, SearchQuery } from "./searchResults.reducer";

export const setSearchResultsActionCreator = (results: Results) => action(SET_RESULTS, results);
export const addToQueryActionCreator = (query: Partial<SearchQuery>) => action(ADD_TO_QUERY, query);
export const resetQueryActionCreator = () => action(ADD_TO_QUERY, {
  search: "",
  departments: [],
  themes: [],
  needs: [],
  age: [],
  frenchLevel: [],
  language: [],
  sort: "date",
  type: "all"
});

export const setInputFocusedActionCreator = (key: keyof InputFocused, value: boolean) => action(SET_INPUT_FOCUSED, { key, value });

const actions = { setSearchResultsActionCreator, addToQueryActionCreator, setInputFocusedActionCreator };

export type SearchResultsActions = ActionType<typeof actions>;
