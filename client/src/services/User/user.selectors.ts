import { RootState } from "../rootReducer";
import { UserState } from "./user.reducer";
import { GetUserInfoResponse, Id } from "@refugies-info/api-types";

export const userSelector = (state: RootState): UserState => state.user;

export const userStructureIdSelector = (state: RootState): Id | null =>
  state.user.user && state.user.user.structures ? state.user.user.structures[0] : null;

export const userDetailsSelector = (state: RootState): GetUserInfoResponse | null => state.user.user;

export const userIdSelector = (state: RootState): Id | null => state.user.user?._id || null;

export const userSelectedLanguageSelector = (
  state: RootState
): Id[] =>
  state.user.user && state.user.user.selectedLanguages ? state.user.user.selectedLanguages : [];
