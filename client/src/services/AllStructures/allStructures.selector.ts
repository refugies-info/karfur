import { RootState } from "../rootReducer";
import { SimplifiedStructureForAdmin } from "../../types/interface";
import { ObjectId } from "mongodb";
import { Id } from "api-types";

export const allStructuresSelector = (
  state: RootState
): SimplifiedStructureForAdmin[] => state.allStructures;

export const structureSelector = (structureId: Id | null) => (
  state: RootState
) => {
  if (!structureId) return null;
  const filteredState = state.allStructures.filter(
    (dispositif) => dispositif._id === structureId
  );

  return filteredState.length > 0 ? filteredState[0] : null;
};
