import { RootState } from "../reducers";

export const selectedI18nCodeSelector = (state: RootState) =>
  state.languages.selectedLanguagei18nCode;
