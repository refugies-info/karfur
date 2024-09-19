import { GetAllUsersResponse, Id } from "@refugies-info/api-types";
import { RootState } from "../rootReducer";

export const allUsersSelector = (state: RootState): GetAllUsersResponse[] => state.users;

export const allActiveUsersSelector = (state: RootState): GetAllUsersResponse[] =>
  state.users.filter((user) => user.status === "Actif");

export const userSelector = (userId: Id | null) => (state: RootState) => {
  if (!userId) return null;
  const filteredState = state.users.filter((user) => user._id === userId);

  return filteredState.length > 0 ? filteredState[0] : null;
};
