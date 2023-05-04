import { RootState } from "../rootReducer";
import { GetLanguagesResponse, Id } from "api-types";

export const languei18nSelector = (state: RootState): string =>
  state.langue.languei18nCode;

export const allLanguesSelector = (state: RootState): GetLanguagesResponse[] =>
  state.langue.langues;

export const showLangModalSelector = (state: RootState): boolean =>
  state.langue.showLangModal;

export const langueSelector = (langueId: Id | null) => (state: RootState) => {
  if (!langueId) return null;
  return state.langue.langues.find((ln) => ln._id?.toString() === langueId.toString());
};
