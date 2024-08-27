import { GetActiveStructuresResponse } from "@refugies-info/api-types";
import { RootState } from "../rootReducer";

export const activeStructuresSelector = (state: RootState): GetActiveStructuresResponse[] => state.activeStructures;
