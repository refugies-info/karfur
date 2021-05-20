import { loadingStatusReducer as reducer } from "../loadingStatus.reducer";
import {
  LoadingStatusKey,
  setError,
  startLoading,
  finishLoading,
} from "../loadingStatus.actions";

describe("[Reducer] LoadingStatus", () => {
  it("sets the loading status to true to the store", () => {
    const state = {};
    expect(
      reducer(state, startLoading(LoadingStatusKey.FETCH_LANGUAGES))
    ).toEqual({
      FETCH_LANGUAGES: {
        isLoading: true,
      },
    });
  });
  it("sets the loading status to false to the store", () => {
    const state = {
      FETCH_LANGUAGES: {
        isLoading: true,
      },
    };
    expect(
      reducer(state, finishLoading(LoadingStatusKey.FETCH_LANGUAGES))
    ).toEqual({
      FETCH_LANGUAGES: {
        isLoading: false,
      },
    });
  });
  it("sets an error to the store", () => {
    const state = {
      FETCH_LANGUAGES: {
        isLoading: true,
        error: undefined,
      },
    };
    expect(
      reducer(
        state,
        setError(LoadingStatusKey.FETCH_LANGUAGES, "error message")
      )
    ).toEqual({
      FETCH_LANGUAGES: {
        isLoading: false,
        error: "error message",
      },
    });
  });
});
