import {
  errorSelector,
  hasErroredSelector,
  isLoadingSelector,
} from "../loadingStatus.selectors";
import { initialRootStateFactory } from "../../reducers";
import { LoadingStatusKey } from "../loadingStatus.actions";

describe("[Selector] LoadingStatus", () => {
  describe("[Selector] isLoadingSelector", () => {
    const state = {
      ...initialRootStateFactory(),
      loadingStatus: {
        FETCH_LANGUAGES: {
          isLoading: true,
        },
      },
    };
    it("selects the loading status", () => {
      expect(
        isLoadingSelector(LoadingStatusKey.FETCH_LANGUAGES)(state)
      ).toEqual(true);
    });
  });

  describe("[Selector] hasErroredSelector", () => {
    const state = {
      ...initialRootStateFactory(),
      loadingStatus: {
        FETCH_LANGUAGES: {
          isLoading: false,
          error: "toto",
        },
      },
    };
    it("selects the loading status", () => {
      expect(
        hasErroredSelector(LoadingStatusKey.FETCH_LANGUAGES)(state)
      ).toEqual(true);
    });
  });

  describe("[Selector] errorMessageSelector", () => {
    const error = "toto";
    const state = {
      ...initialRootStateFactory(),
      loadingStatus: {
        FETCH_LANGUAGES: {
          isLoading: false,
          error,
        },
      },
    };
    it("selects the loading status", () => {
      expect(errorSelector(LoadingStatusKey.FETCH_LANGUAGES)(state)).toEqual(
        error
      );
    });
  });
});
