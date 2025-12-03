import type { Reducer } from "redux";
import type { SearchCountsResponse } from "../../pages/api/search/counts";
import type { SearchQuery } from "../SearchResults/searchResults.reducer";

// STATE
export interface SearchCountsState {
  data: SearchCountsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialSearchCountsState: SearchCountsState = {
  data: null,
  loading: false,
  error: null,
};

// ACTION TYPES
const FETCH_SEARCH_COUNTS_REQUEST = "FETCH_SEARCH_COUNTS_REQUEST";
const FETCH_SEARCH_COUNTS_SUCCESS = "FETCH_SEARCH_COUNTS_SUCCESS";
const FETCH_SEARCH_COUNTS_FAILURE = "FETCH_SEARCH_COUNTS_FAILURE";

// ACTIONS
export const fetchSearchCountsRequest = (query: SearchQuery) =>
  ({ type: FETCH_SEARCH_COUNTS_REQUEST, payload: query }) as const;
export const fetchSearchCountsSuccess = (data: SearchCountsResponse) =>
  ({ type: FETCH_SEARCH_COUNTS_SUCCESS, payload: data }) as const;
export const fetchSearchCountsFailure = (error: string) =>
  ({ type: FETCH_SEARCH_COUNTS_FAILURE, payload: error }) as const;

type SearchCountsAction =
  | ReturnType<typeof fetchSearchCountsRequest>
  | ReturnType<typeof fetchSearchCountsSuccess>
  | ReturnType<typeof fetchSearchCountsFailure>;

// REDUCER
const searchCountsReducer: Reducer<SearchCountsState, SearchCountsAction> = (
  state = initialSearchCountsState,
  action,
) => {
  switch (action.type) {
    case FETCH_SEARCH_COUNTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SEARCH_COUNTS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_SEARCH_COUNTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default searchCountsReducer;
