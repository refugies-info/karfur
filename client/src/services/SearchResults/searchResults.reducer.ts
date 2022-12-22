import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";
import { ObjectId } from "mongodb";
import { SearchDispositif } from "types/interface";
import { createReducer } from "typesafe-actions";
import { SearchResultsActions } from "./searchResults.actions";

export type InputFocused = {
  search: boolean;
  location: boolean;
  theme: boolean;
};

export type Results = {
  dispositifs: SearchDispositif[];
  demarches: SearchDispositif[];
  dispositifsSecondaryTheme: SearchDispositif[];
};

export type SearchQuery = {
  search: string;
  departments: string[];
  themes: ObjectId[];
  needs: ObjectId[];
  age: AgeOptions[];
  frenchLevel: FrenchOptions[];
  language: string[];
  sort: SortOptions;
  type: TypeOptions;
};

export interface SearchResultsState {
  results: Results;
  query: SearchQuery;
  inputFocused: InputFocused;
}

const initialSearchResultsState: SearchResultsState = {
  results: {
    dispositifs: [],
    demarches: [],
    dispositifsSecondaryTheme: []
  },
  query: {
    search: "",
    departments: [],
    themes: [],
    needs: [],
    age: [],
    frenchLevel: [],
    language: [],
    sort: "date",
    type: "all",
  },
  inputFocused: {
    search: false,
    location: false,
    theme: false,
  }
};

export const searchResultsReducer = createReducer<SearchResultsState, SearchResultsActions>(initialSearchResultsState, {
  SET_RESULTS: (state, action) =>
    ({ ...state, results: action.payload }),
  ADD_TO_QUERY: (state, action) =>
    ({ ...state, query: { ...state.query, ...action.payload } }),
  SET_INPUT_FOCUSED: (state, action) =>
    ({ ...state, inputFocused: { ...state.inputFocused, [action.payload.key]: action.payload.value } })
});
