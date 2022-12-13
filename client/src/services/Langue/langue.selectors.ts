import { RootState } from "../rootReducer";
import { Language } from "../../types/interface";
import { ObjectId } from "mongodb";

export const languei18nSelector = (state: RootState): string =>
  state.langue.languei18nCode;

export const allLanguesSelector = (state: RootState): Language[] =>
  state.langue.langues;

export const showLangModalSelector = (state: RootState): boolean =>
  state.langue.showLangModal;

export const langueSelector = (langueId: ObjectId | string | null) => (state: RootState) => {
  if (!langueId) return null;
  return state.langue.langues.find((ln) => ln._id?.toString() === langueId.toString());
};
