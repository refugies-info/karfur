import { RootState } from "../rootReducer";
import { GetAllStructuresResponse, Id } from "api-types";

export const allStructuresSelector = (
  state: RootState
): GetAllStructuresResponse[] => state.allStructures;

export const structureSelector = (structureId: Id | null) => (
  state: RootState
) => {
  if (!structureId) return null;
  const filteredState = state.allStructures.filter(
    (structure) => structure._id === structureId
  );

  return filteredState.length > 0 ? filteredState[0] : null;
};
