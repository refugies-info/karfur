import { GetAllDispositifsResponse, Id } from "@refugies-info/api-types";
import { RootState } from "../rootReducer";

export const allDispositifsSelector = (state: RootState): GetAllDispositifsResponse[] => state.allDispositifs;

export const dispositifSelector = (dispositifId: Id | null) => (state: RootState) => {
  if (!dispositifId) return null;
  const filteredState = state.allDispositifs.filter((dispositif) => dispositif._id === dispositifId);

  return filteredState.length > 0 ? filteredState[0] : null;
};
