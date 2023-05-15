import { SagaIterator } from "redux-saga";
import { takeLatest, call, put, select } from "redux-saga/effects";
import API from "../../utils/API";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { GET_NEEDS, SAVE_NEED, CREATE_NEED, DELETE_NEED, ORDER_NEEDS } from "./needs.actionTypes";
import {
  setNeedsActionCreator,
  saveNeedActionCreator,
  fetchNeedsActionCreator,
  createNeedActionCreator,
  deleteNeedActionCreator,
  orderNeedsActionCreator
} from "./needs.actions";
import { needsSelector } from "./needs.selectors";
import { GetNeedResponse, UpdatePositionsNeedResponse } from "api-types";

export function* fetchNeeds(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_NEEDS));
    logger.info("[fetchNeeds] start fetching needs");
    const data: GetNeedResponse[] = yield call(API.getNeeds);
    yield put(setNeedsActionCreator(data));
    yield put(finishLoading(LoadingStatusKey.FETCH_NEEDS));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while fetching needs ", {
      error: message,
    });
    yield put(setNeedsActionCreator([]));
  }
}

export function* saveNeed(
  action: ReturnType<typeof saveNeedActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.SAVE_NEED));
    const newNeed = action.payload.value;
    const id = action.payload.id;
    logger.info("[saveNeed] start saving need");
    yield call(API.patchNeed, id, newNeed);
    yield put(fetchNeedsActionCreator());
    yield put(finishLoading(LoadingStatusKey.SAVE_NEED));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while saving need ", {
      error: message,
      need: action.payload,
    });
    yield put(setNeedsActionCreator([]));
  }
}

export function* orderNeeds(
  action: ReturnType<typeof orderNeedsActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.SAVE_NEED));
    logger.info("[saveNeed] start saving need order");
    const data: UpdatePositionsNeedResponse[] = yield call(API.orderNeeds, action.payload);
    if (data) {
      const newNeeds: GetNeedResponse[] = [...(yield select(needsSelector))];
      for (const newNeed of data) {
        const editedNeedIndex = newNeeds.findIndex(n => n._id === newNeed._id);
        newNeeds[editedNeedIndex] = newNeed;
      }
      yield put(setNeedsActionCreator(newNeeds));
    }
    yield put(finishLoading(LoadingStatusKey.SAVE_NEED));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while saving need order", {
      error: message,
      need: action.payload,
    });
    yield put(setNeedsActionCreator([]));
  }
}

export function* createNeed(
  action: ReturnType<typeof createNeedActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.SAVE_NEED));
    const newNeed = action.payload;
    logger.info("[createNeed] start creating need");
    yield call(API.postNeeds, newNeed);
    yield put(fetchNeedsActionCreator());
    yield put(finishLoading(LoadingStatusKey.SAVE_NEED));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while creating need ", {
      error: message,
      need: action.payload,
    });
    yield put(setNeedsActionCreator([]));
  }
}

export function* deleteNeed(
  action: ReturnType<typeof deleteNeedActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.DELETE_WIDGET));
    logger.info("[deleteNeed] start deleting need");
    yield call(API.deleteNeed, action.payload);

    const needs: GetNeedResponse[] = [...(yield select(needsSelector))];
    yield put(setNeedsActionCreator(needs.filter(n => n._id !== action.payload)));

    yield put(finishLoading(LoadingStatusKey.DELETE_WIDGET));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while deleting need ", {
      error: message,
      need: action.payload,
    });
  }
}

function* latestActionsSaga() {
  yield takeLatest(GET_NEEDS, fetchNeeds);
  yield takeLatest(SAVE_NEED, saveNeed);
  yield takeLatest(CREATE_NEED, createNeed);
  yield takeLatest(DELETE_NEED, deleteNeed);
  yield takeLatest(ORDER_NEEDS, orderNeeds);
}

export default latestActionsSaga;
