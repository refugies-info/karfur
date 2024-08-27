import { GetUserInfoResponse } from "@refugies-info/api-types";
import { AxiosError } from "axios";
import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { logger } from "../../logger";
import API from "../../utils/API";
import { finishLoading, LoadingStatusKey, setError, startLoading } from "../LoadingStatus/loadingStatus.actions";
import { searchQuerySelector } from "../SearchResults/searchResults.selector";
import { fetchUserStructureActionCreator } from "../UserStructure/userStructure.actions";
import { fetchUserActionCreator, saveUserActionCreator, setUserActionCreator } from "./user.actions";
import { FETCH_USER, SAVE_USER } from "./user.actionTypes";
import { userSelector } from "./user.selectors";

export function* fetchUser(action: ReturnType<typeof fetchUserActionCreator>): SagaIterator {
  try {
    logger.info("[fetchUser] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_USER));
    const isAuth = yield call(API.isAuth);
    const authenticated = isAuth || action.payload?.token;
    if (authenticated) {
      const currentUser = yield select(userSelector);
      // Only fetch user if it is not already set
      if (!currentUser || !currentUser.id) {
        const data: GetUserInfoResponse = yield call(API.getUser, { token: action.payload?.token });
        yield put(setUserActionCreator(data));
        // Only add departments from user profile to query if they are not already set
        const currentQuery = yield select(searchQuerySelector);
        if (
          (data.departments?.length || 0) > 0 &&
          (!currentQuery.departments || currentQuery.departments.length === 0)
        ) {
          yield put(
            addToQueryActionCreator({
              departments: (data.departments || [])?.map((dep) => dep.split(" - ")[1]),
              sort: "location",
            }),
          );
        }
        if (data.structures && data.structures.length > 0) {
          yield put(
            fetchUserStructureActionCreator({
              structureId: data.structures[0],
              shouldRedirect: false,
            }),
          );
        }
      }
    } else {
      yield put(setUserActionCreator(null));
    }
    yield put(finishLoading(LoadingStatusKey.FETCH_USER));
    logger.info("[fetchUser] saga finish");
  } catch (error) {
    logger.error("Error while fetching user", { error });
    yield put(setUserActionCreator(null));
  }
}

export function* saveUser(action: ReturnType<typeof saveUserActionCreator>): SagaIterator {
  try {
    logger.info("[saveUser] saga", { payload: action.payload });
    yield put(startLoading(LoadingStatusKey.SAVE_USER));
    const { id, value } = action.payload;
    yield call(API.updateUser, id, value);
    yield put(fetchUserActionCreator());
    yield put(finishLoading(LoadingStatusKey.SAVE_USER));
  } catch (error) {
    logger.error("[saveUser] saga error", { error });
    if ((<AxiosError<{ code?: string }, unknown>>error).response?.data?.code === "WRONG_CODE") {
      yield put(setError(LoadingStatusKey.SAVE_USER, "WRONG_CODE"));
    } else {
      yield put(setUserActionCreator(null));
      yield put(finishLoading(LoadingStatusKey.SAVE_USER));
    }
  }
}

function* latestActionsSaga() {
  yield takeLatest(FETCH_USER, fetchUser);
  yield takeLatest(SAVE_USER, saveUser);
}

export default latestActionsSaga;
