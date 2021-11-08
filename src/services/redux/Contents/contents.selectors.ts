import { RootState } from "../reducers";
import { AvailableLanguageI18nCode } from "../../../types/interface";

export const contentsSelector = (langue: AvailableLanguageI18nCode) => (
  state: RootState
) => state.contents[langue];

export const mostViewedContentsSelector = (langue: AvailableLanguageI18nCode) => (
  state: RootState
) => state.contents[langue].sort((a, b) => b.nbVues - a.nbVues).slice(0, 10);
