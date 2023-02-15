import { RootState } from "../rootReducer";
import { SimplifiedDispositif } from "../../types/interface";
import { ObjectId } from "mongodb";
import { Id } from "api-types";

export const allDispositifsSelector = (
  state: RootState
): SimplifiedDispositif[] => state.allDispositifs;

export const dispositifSelector = (dispositifId: Id | null) => (
  state: RootState
) => {
  if (!dispositifId) return null;
  const filteredState = state.allDispositifs.filter(
    (dispositif) => dispositif._id === dispositifId
  );

  return filteredState.length > 0 ? filteredState[0] : null;
};
