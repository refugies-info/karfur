import { RootState } from "../rootReducer";
import { UserState } from "./user.reducer";

export const userSelector = (state: RootState): UserState => state.user;
