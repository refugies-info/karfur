import { call, put, takeLatest } from "redux-saga/effects";
import type { SearchCountsResponse } from "../../pages/api/search/counts";
import type { SearchQuery } from "../SearchResults/searchResults.reducer";
import { fetchSearchCountsFailure, fetchSearchCountsSuccess } from "./searchCounts.reducer";
import { getSearchCounts } from "./searchCounts.service";

function* fetchSearchCounts(action: { type: string; payload: SearchQuery }) {
  try {
    const data: SearchCountsResponse = yield call(getSearchCounts, action.payload);
    yield put(fetchSearchCountsSuccess(data));
  } catch (error: any) {
    yield put(fetchSearchCountsFailure(error.message));
  }
}

export function* searchCountsSaga() {
  yield takeLatest("FETCH_SEARCH_COUNTS_REQUEST", fetchSearchCounts);
}
