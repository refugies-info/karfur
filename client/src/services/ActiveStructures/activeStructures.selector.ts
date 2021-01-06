import { RootState } from "../rootReducer";
import { SimplifiedStructure } from "../../types/interface";

export const activeStructuresSelector = (
  state: RootState
): SimplifiedStructure[] => state.activeStructures;
