import { createSelector } from "reselect";
import type { RootState } from "../rootReducer";

const searchCountsStateSelector = (state: RootState) => state.searchCounts;

export const searchCountsDataSelector = createSelector(
  [searchCountsStateSelector],
  (state) => state.data,
);

export const searchCountsLoadingSelector = createSelector(
  [searchCountsStateSelector],
  (state) => state.loading,
);

export const searchCountsErrorSelector = createSelector(
  [searchCountsStateSelector],
  (state) => state.error,
);
