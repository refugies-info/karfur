import { SagaIterator } from "redux-saga";
import { takeLatest, call, put, select } from "redux-saga/effects";
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
  createWidgetActionCreator,
  deleteWidgetActionCreator
} from "./widgets.actions";
import { widgetsSelector } from "./widgets.selectors";
import { Widget } from "types/interface";

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
    yield put(finishLoading(LoadingStatusKey.FETCH_WIDGETS));
  }
}

export function* saveWidget(
  action: ReturnType<typeof saveWidgetActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.SAVE_WIDGET));
    const newWidget = action.payload;
    logger.info("[saveWidget] start saving widget");

    const data = yield call(API.patchWidget, newWidget);
    if (data.data.data) {
      const newWidgets: Widget[] = [...yield select(widgetsSelector)];
      const editedWidgetIndex = newWidgets.findIndex(w => w._id === action.payload._id);
      newWidgets[editedWidgetIndex] = data.data.data;
      yield put(setWidgetsActionCreator(newWidgets));
    }

    yield put(finishLoading(LoadingStatusKey.SAVE_WIDGET));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while saving widget ", {
      error: message,
      widget: action.payload,
    });
  }
}

export function* createWidget(
  action: ReturnType<typeof createWidgetActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.CREATE_WIDGET));
    const newWidget = action.payload;
    logger.info("[createWidget] start creating widget");

    const data = yield call(API.postWidgets, newWidget);
    const widgets: Widget[] = [...yield select(widgetsSelector)];
    yield put(setWidgetsActionCreator([data.data.data, ...widgets]));

    yield put(finishLoading(LoadingStatusKey.CREATE_WIDGET));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while creating widget ", {
      error: message,
      widget: action.payload,
    });
  }
}

export function* deleteWidget(
  action: ReturnType<typeof deleteWidgetActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.DELETE_WIDGET));
    logger.info("[deleteWidget] start deleting widget");
    yield call(API.deleteWidget, action.payload);

    const widgets: Widget[] = [...yield select(widgetsSelector)];
    yield put(setWidgetsActionCreator(widgets.filter(w => w._id !== action.payload)));

    yield put(finishLoading(LoadingStatusKey.DELETE_WIDGET));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while deleting widget ", {
      error: message,
      widget: action.payload,
    });
  }
}

function* latestActionsSaga() {
  yield takeLatest(GET_WIDGETS, fetchWidgets);
  yield takeLatest(SAVE_WIDGET, saveWidget);
  yield takeLatest(CREATE_WIDGET, createWidget);
  yield takeLatest(DELETE_WIDGET, deleteWidget);
}

export default latestActionsSaga;
