import { RootState } from "../rootReducer";
import { StructureState } from "./structures.reducer";
import { Structure } from "../../@types/interface";

export const userStructureSelector = (state: RootState): Structure | null =>
  state.structure.userStructure;
