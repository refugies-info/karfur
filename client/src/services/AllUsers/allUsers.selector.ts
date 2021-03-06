import { RootState } from "../rootReducer";
import { SimplifiedUser } from "../../types/interface";
import { ObjectId } from "mongodb";

export const allUsersSelector = (state: RootState): SimplifiedUser[] =>
  state.users;

export const activeUsersSelector = (state: RootState): SimplifiedUser[] =>
  state.users.filter((user) => user.status === "Actif");

export const userSelector = (userId: ObjectId | null) => (state: RootState) => {
  if (!userId) return null;
  const filteredState = state.users.filter((user) => user._id === userId);

  return filteredState.length > 0 ? filteredState[0] : null;
};
