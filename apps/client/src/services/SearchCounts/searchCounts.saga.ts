import { call, put, takeLatest } from "redux-saga/effects";
import { getSearchCounts } from "./searchCounts.service";
import {
  fetchSearchCountsSuccess,
  fetchSearchCountsFailure,
} from "./searchCounts.reducer";
import { SearchQuery } from "../SearchResults/searchResults.reducer";
import { SearchCountsResponse } from "../../pages/api/search/counts";

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
