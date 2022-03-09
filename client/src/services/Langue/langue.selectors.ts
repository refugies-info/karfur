import { RootState } from "../rootReducer";
import { Language } from "../../types/interface";

export const languei18nSelector = (state: RootState): string =>
  state.langue.languei18nCode;

export const allLanguesSelector = (state: RootState): Language[] =>
  state.langue.langues;

export const showLangModalSelector = (state: RootState): boolean =>
  state.langue.showLangModal;
