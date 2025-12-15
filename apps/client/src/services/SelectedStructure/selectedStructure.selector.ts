import type { GetStructureResponse, Id } from "@refugies-info/api-types";
import type { RootState } from "../rootReducer";

export const selectedStructureSelector = (state: RootState): GetStructureResponse | null =>
  state.selectedStructure;

export const selectedStructureIdSelector = (state: RootState): Id | null =>
  state.selectedStructure?._id || null;
