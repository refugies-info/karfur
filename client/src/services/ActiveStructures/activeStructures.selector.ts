import { RootState } from "../rootReducer";
import { GetActiveStructuresResponse } from "api-types";

export const activeStructuresSelector = (
  state: RootState
): GetActiveStructuresResponse[] => state.activeStructures;
