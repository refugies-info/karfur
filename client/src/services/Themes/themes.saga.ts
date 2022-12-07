import { SagaIterator } from "redux-saga";
import { takeLatest, call, put, select } from "redux-saga/effects";
import API from "../../utils/API";
import { logger } from "../../logger";
import {
  startLoading,
  LoadingStatusKey,
  finishLoading,
} from "../LoadingStatus/loadingStatus.actions";
import { GET_THEMES, SAVE_THEME, CREATE_THEME, DELETE_THEME } from "./themes.actionTypes";
import {
  setThemesActionCreator,
  saveThemeActionCreator,
  createThemeActionCreator,
  deleteThemeActionCreator
} from "./themes.actions";
import { allThemesSelector} from "./themes.selectors";
import { Theme } from "types/interface";

export function* fetchThemes(): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.FETCH_THEMES));
    logger.info("[fetchThemes] start fetching themes");
    const data = yield call(API.getThemes);

    const themes = data?.data?.data || [];
    yield put(setThemesActionCreator(themes));

    yield put(finishLoading(LoadingStatusKey.FETCH_THEMES));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while fetching themes ", {
      error: message,
    });
    yield put(setThemesActionCreator([]));
    yield put(finishLoading(LoadingStatusKey.FETCH_THEMES));
  }
}

export function* saveTheme(
  action: ReturnType<typeof saveThemeActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.SAVE_THEME));
    const newTheme = action.payload;
    logger.info("[saveTheme] start saving theme");

    const data = yield call(API.patchTheme, newTheme);
    if (data.data.data) {
      const newThemes: Theme[] = [...(yield select(allThemesSelector))];
      const editedThemeIndex = newThemes.findIndex(w => w._id === action.payload._id);
      newThemes[editedThemeIndex] = data.data.data;
      yield put(setThemesActionCreator(newThemes));
    }

    yield put(finishLoading(LoadingStatusKey.SAVE_THEME));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while saving theme ", {
      error: message,
      theme: action.payload,
    });
  }
}

export function* createTheme(
  action: ReturnType<typeof createThemeActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.CREATE_THEME));
    const newTheme = action.payload;
    logger.info("[createTheme] start creating theme");

    const data = yield call(API.postThemes, newTheme);
    const themes: Theme[] = [...(yield select(allThemesSelector))];
    yield put(setThemesActionCreator([data.data.data, ...themes]));

    yield put(finishLoading(LoadingStatusKey.CREATE_THEME));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while creating theme ", {
      error: message,
      theme: action.payload,
    });
  }
}

export function* deleteTheme(
  action: ReturnType<typeof deleteThemeActionCreator>
): SagaIterator {
  try {
    yield put(startLoading(LoadingStatusKey.DELETE_THEME));
    logger.info("[deleteTheme] start deleting theme");
    yield call(API.deleteTheme, action.payload);

    const themes: Theme[] = [...(yield select(allThemesSelector))];
    yield put(setThemesActionCreator(themes.filter(w => w._id !== action.payload)));

    yield put(finishLoading(LoadingStatusKey.DELETE_THEME));
  } catch (error) {
    const { message } = error as Error;
    logger.error("Error while deleting theme ", {
      error: message,
      theme: action.payload,
    });
  }
}

function* latestActionsSaga() {
  yield takeLatest(GET_THEMES, fetchThemes);
  yield takeLatest(SAVE_THEME, saveTheme);
  yield takeLatest(CREATE_THEME, createTheme);
  yield takeLatest(DELETE_THEME, deleteTheme);
}

export default latestActionsSaga;
