import { RootState } from "../rootReducer";
import { GetActiveStructuresResponse } from "@refugies-info/api-types";

export const activeStructuresSelector = (
  state: RootState
): GetActiveStructuresResponse[] => state.activeStructures;
