import { RootState } from "../rootReducer";
import { Structure } from "../../@types/interface";

export const selectedStructureSelector = (state: RootState): Structure | null =>
  state.selectedStructure;
