import { RootState } from "../rootReducer";
import { GetNeedResponse, Id } from "@refugies-info/api-types";

export const needsSelector = (state: RootState): GetNeedResponse[] => state.needs;

export const needSelector = (needId: Id | null) => (state: RootState) => {
  if (!needId) return null;
  const filteredState = state.needs.filter((need) => need._id === needId);

  return filteredState.length > 0 ? filteredState[0] : null;
};

export const dispositifNeedsSelector = (needsId: Id[] | undefined) => (state: RootState): GetNeedResponse[] => {
  if (!needsId) return [];
  const needs = needsId
    .map(needId => state.needs.find((need) => need._id === needId))
    .filter(t => t !== undefined) as GetNeedResponse[];

  return needs;
};
