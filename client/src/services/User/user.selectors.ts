import { RootState } from "../rootReducer";
import { UserState } from "./user.reducer";
import { ObjectId } from "mongodb";
import { User, UserLanguage } from "../../types/interface";

export const userSelector = (state: RootState): UserState => state.user;

export const userStructureIdSelector = (state: RootState): ObjectId | null =>
  state.user.user && state.user.user.structures
    ? state.user.user.structures[0]
    : null;

export const userDetailsSelector = (state: RootState): User | null =>
  state.user.user;

export const userSelectedLanguageSelector = (
  state: RootState
): UserLanguage[] | [] =>
  state.user.user && state.user.user.selectedLanguages
    ? state.user.user.selectedLanguages
    : [];
