import type { RootState } from "../reducers";

export const availableLanguagesSelector = (state: RootState) => state.languages.availableLanguages;
