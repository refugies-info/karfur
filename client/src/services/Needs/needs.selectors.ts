import { RootState } from "../rootReducer";
import { GetNeedResponse, Id } from "api-types";

export const needsSelector = (state: RootState): GetNeedResponse[] => state.needs;

export const needSelector = (needId: Id | null | undefined) => (state: RootState) => {
  if (!needId) return null;
  const filteredState = state.needs.filter((need) => need._id === needId);

  return filteredState.length > 0 ? filteredState[0] : null;
};
