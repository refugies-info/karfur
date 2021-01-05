import { RootState } from "../rootReducer";
import { SimplifiedUser } from "../../types/interface";

export const allUsersSelector = (state: RootState): SimplifiedUser[] =>
  state.users;

export const activeUsersSelector = (state: RootState): SimplifiedUser[] =>
  state.users.filter((user) => user.status === "Actif");
