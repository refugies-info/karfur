import { RootState } from "../rootReducer";
import { Structure } from "../../types/interface";

export const userStructureSelector = (state: RootState): Structure | null =>
  state.structure;
