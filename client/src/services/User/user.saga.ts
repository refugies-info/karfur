import { SagaIterator } from "redux-saga";
import { takeLatest, put, call } from "redux-saga/effects";
import { FETCH_USER, SAVE_USER } from "./user.actionTypes";
import API from "../../utils/API";
import {
  setUserActionCreator,
  fetchUserActionCreator,
  saveUserActionCreator,
} from "./user.actions";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
  setError
} from "../LoadingStatus/loadingStatus.actions";
import { fetchUserStructureActionCreator } from "../UserStructure/userStructure.actions";
import { AxiosError } from "axios";
import { GetUserInfoResponse } from "@refugies-info/api-types";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";

export function* fetchUser(
  action: ReturnType<typeof fetchUserActionCreator>
): SagaIterator {
  try {
    logger.info("[fetchUser] saga");
    yield put(startLoading(LoadingStatusKey.FETCH_USER));
    const isAuth = yield call(API.isAuth);
    const authenticated = isAuth || action.payload?.token;
    if (authenticated) {
      const data: GetUserInfoResponse = yield call(API.getUser, { token: action.payload?.token });
      yield put(setUserActionCreator(data));
      if ((data.departments?.length || 0) > 0) {
        yield put(addToQueryActionCreator({ departments: (data.departments || [])?.map(dep => dep.split(" - ")[1]), sort: "location" }))
      }
      if (data.structures && data.structures.length > 0) {
        yield put(
          fetchUserStructureActionCreator({
            structureId: data.structures[0],
            shouldRedirect: false,
          })
        );
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

export function* saveUser(
  action: ReturnType<typeof saveUserActionCreator>
): SagaIterator {
  try {
    logger.info("[saveUser] saga", { payload: action.payload });
    yield put(startLoading(LoadingStatusKey.SAVE_USER));
    const { id, value } = action.payload;
    yield call(API.updateUser, id, value);
    yield put(fetchUserActionCreator());
    yield put(finishLoading(LoadingStatusKey.SAVE_USER));
  } catch (error) {
    logger.error("[saveUser] saga error", { error });
    if ((<AxiosError>error).response?.data?.code === "WRONG_CODE") {
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
