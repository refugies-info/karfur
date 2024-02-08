import { GetUserInfoResponse, Id } from "@refugies-info/api-types";
import { RootState } from "../rootReducer";
import { UserState } from "./user.reducer";

export const userSelector = (state: RootState): UserState => state.user;

export const userDetailsSelector = (state: RootState): GetUserInfoResponse | null => state.user.user;

export const userIdSelector = (state: RootState): Id | null => state.user.userId;

export const userStructureIdSelector = (state: RootState): Id | null =>
  state.user.user?.structures ? state.user.user.structures[0] : null;

export const userSelectedLanguageSelector = (state: RootState): Id[] =>
  state.user.user?.selectedLanguages ? state.user.user.selectedLanguages : [];
