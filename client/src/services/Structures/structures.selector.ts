import { RootState } from "../rootReducer";
import { SimplifiedStructure } from "../../@types/interface";

export const structuresSelector = (state: RootState): SimplifiedStructure[] =>
  state.structures;
