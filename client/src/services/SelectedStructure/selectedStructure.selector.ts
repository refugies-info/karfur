import { RootState } from "../rootReducer";
import { GetStructureResponse, Id } from "@refugies-info/api-types";

export const selectedStructureSelector = (state: RootState): GetStructureResponse | null =>
  state.selectedStructure;

export const selectedStructureIdSelector = (state: RootState): Id | null =>
  state.selectedStructure?._id || null
