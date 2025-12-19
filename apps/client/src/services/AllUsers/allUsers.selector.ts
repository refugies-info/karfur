import type { GetAllUsersResponse, Id } from "@refugies-info/api-types";
import { createSelector } from "reselect";
import type { RootState } from "../rootReducer";

export const allUsersSelector = (state: RootState): GetAllUsersResponse[] => state.users;

const selectAllActiveUsers = (state: RootState) => state.users;
export const allActiveUsersSelector = createSelector(
  [selectAllActiveUsers],
  (selectAllActiveUsers) => selectAllActiveUsers.filter((user) => user.status === "Actif"),
);

export const userSelector = (userId: Id | null) => (state: RootState) => {
  if (!userId) return null;
  const filteredState = state.users.filter((user) => user._id === userId);

  return filteredState.length > 0 ? filteredState[0] : null;
};
