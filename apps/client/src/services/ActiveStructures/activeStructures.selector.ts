import type { GetActiveStructuresResponse } from "@refugies-info/api-types";
import type { RootState } from "../rootReducer";

export const activeStructuresSelector = (state: RootState): GetActiveStructuresResponse[] =>
  state.activeStructures;
