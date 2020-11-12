import { RootState } from "../rootReducer";
import { UserState } from "./user.reducer";
import { ObjectId } from "mongodb";

export const userSelector = (state: RootState): UserState => state.user;

export const userStructureIdSelector = (state: RootState): ObjectId | null =>
  state.user.user && state.user.user.structures
    ? state.user.user.structures[0]
    : null;
