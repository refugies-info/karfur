import { RootState } from "../rootReducer";
import { Structure } from "../../types/interface";
import { ObjectId } from "mongodb";

export const selectedStructureSelector = (state: RootState): Structure | null =>
  state.selectedStructure;

export const selectedStructureIdSelector = (state: RootState): ObjectId | null =>
  state.selectedStructure && state.selectedStructure._id
    ? state.selectedStructure._id
    : null;
