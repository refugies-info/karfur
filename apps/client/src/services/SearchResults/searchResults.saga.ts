import { call, put, select, takeLatest } from "redux-saga/effects";
import type { SearchResponse } from "~/lib/search-helpers";
import { languei18nSelector } from "~/services/Langue/langue.selectors";
import { fetchSearchCountsRequest } from "~/services/SearchCounts/searchCounts.reducer";
import {
  appendSearchResults,
  fetchSearchResultsFailure,
  fetchSearchResultsSuccess,
  setSearchLoading,
} from "./searchResults.actions";
import {
  FETCH_SEARCH_RESULTS_NEXT_PAGE,
  FETCH_SEARCH_RESULTS_REQUEST,
} from "./searchResults.actionTypes";
import type { SearchQuery } from "./searchResults.reducer";
import { searchPaginationSelector, searchQuerySelector } from "./searchResults.selector";
import { fetchSearchResults } from "./searchResults.service";

const COUNTS_DISABLED = process.env.NEXT_PUBLIC_DISABLE_SEARCH_COUNTS === "true";

function* handleFetchSearchResults(action: { type: string; payload: SearchQuery }) {
  try {
    yield put(setSearchLoading(true));
    if (!COUNTS_DISABLED) {
      yield put(fetchSearchCountsRequest(action.payload));
    }
    const locale: string = yield select(languei18nSelector);
    const data: SearchResponse = yield call(fetchSearchResults, action.payload, 1, locale || "fr");
    yield put(fetchSearchResultsSuccess(data));
  } catch (error: any) {
    yield put(fetchSearchResultsFailure(error.message));
  }
}

function* handleFetchNextPage() {
  try {
    yield put(setSearchLoading(true));
    const query: SearchQuery = yield select(searchQuerySelector);
    const pagination: { page: number } = yield select(searchPaginationSelector);
    const locale: string = yield select(languei18nSelector);
    const nextPage = pagination.page + 1;
    const data: SearchResponse = yield call(fetchSearchResults, query, nextPage, locale || "fr");
    yield put(appendSearchResults(data));
  } catch (error: any) {
    yield put(fetchSearchResultsFailure(error.message));
  }
}

export function* searchResultsSaga() {
  yield takeLatest(FETCH_SEARCH_RESULTS_REQUEST, handleFetchSearchResults);
  yield takeLatest(FETCH_SEARCH_RESULTS_NEXT_PAGE, handleFetchNextPage);
}
