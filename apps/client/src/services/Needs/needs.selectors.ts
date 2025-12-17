import type { GetNeedResponse, Id } from "@refugies-info/api-types";
import { createSelector } from "reselect";
import type { RootState } from "../rootReducer";

export const needsSelector = (state: RootState): GetNeedResponse[] => state.needs;

export const needSelector = (needId: Id | null) => (state: RootState) => {
  if (!needId) return null;
  const filteredState = state.needs.filter((need) => need._id === needId);

  return filteredState.length > 0 ? filteredState[0] : null;
};

export const dispositifNeedsSelector = (needsId: Id[] | undefined) =>
  createSelector([needsSelector], (allNeeds): GetNeedResponse[] => {
    if (!needsId) return [];
    const needs = needsId
      .map((needId) => allNeeds.find((need) => need._id === needId))
      .filter((t) => t !== undefined) as GetNeedResponse[];

    return needs;
  });
