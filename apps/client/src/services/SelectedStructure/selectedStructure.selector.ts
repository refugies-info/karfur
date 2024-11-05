import { GetStructureResponse, Id } from "@refugies-info/api-types";
import { RootState } from "../rootReducer";

export const selectedStructureSelector = (state: RootState): GetStructureResponse | null => state.selectedStructure;

export const selectedStructureIdSelector = (state: RootState): Id | null => state.selectedStructure?._id || null;
