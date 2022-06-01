import { SagaIterator } from "redux-saga";
import { takeLatest, call, put } from "redux-saga/effects";
import API from "../../utils/API";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { GET_WIDGETS, SAVE_WIDGET, CREATE_WIDGET, DELETE_WIDGET } from "./widgets.actionTypes";
import {
  setWidgetsActionCreator,
  saveWidgetActionCreator,
  fetchWidgetsActionCreator,
  createWidgetActionCreator,
  deleteWidgetActionCreator
} from "./widgets.actions";

export function* fetchWidgets(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_WIDGETS));
    logger.info("[fetchWidgets] start fetching widgets");
    const data = yield call(API.getWidgets);

    const widgets = data?.data?.data || [];
    yield put(setWidgetsActionCreator(widgets));

    yield put(finishLoading(LoadingStatusKey.FETCH_WIDGETS));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while fetching widgets ", {
      error: message,
    });
    yield put(setWidgetsActionCreator([]));
  }
}

export function* saveWidget(
  action: ReturnType<typeof saveWidgetActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.SAVE_WIDGET));
    const newWidget = action.payload;
    logger.info("[saveWidget] start saving widget");
    yield call(API.patchWidget, newWidget);
    yield put(fetchWidgetsActionCreator());
    yield put(finishLoading(LoadingStatusKey.SAVE_WIDGET));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while saving widget ", {
      error: message,
      widget: action.payload,
    });
    yield put(setWidgetsActionCreator([]));
  }
}

export function* createWidget(
  action: ReturnType<typeof createWidgetActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.SAVE_WIDGET));
    const newWidget = action.payload;
    logger.info("[createWidget] start creating widget");
    yield call(API.postWidgets, newWidget);
    yield put(fetchWidgetsActionCreator());
    yield put(finishLoading(LoadingStatusKey.SAVE_WIDGET));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while creating widget ", {
      error: message,
      widget: action.payload,
    });
    yield put(setWidgetsActionCreator([]));
  }
}

export function* deleteWidget(
  action: ReturnType<typeof deleteWidgetActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.DELETE_WIDGET));
    logger.info("[deleteWidget] start deleting widget");
    yield call(API.deleteWidget, action.payload);
    yield put(fetchWidgetsActionCreator());
    yield put(finishLoading(LoadingStatusKey.DELETE_WIDGET));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while deleting widget ", {
      error: message,
      widget: action.payload,
    });
    yield put(setWidgetsActionCreator([]));
  }
}

function* latestActionsSaga() {
  yield takeLatest(GET_WIDGETS, fetchWidgets);
  yield takeLatest(SAVE_WIDGET, saveWidget);
  yield takeLatest(CREATE_WIDGET, createWidget);
  yield takeLatest(DELETE_WIDGET, deleteWidget);
}

export default latestActionsSaga;
