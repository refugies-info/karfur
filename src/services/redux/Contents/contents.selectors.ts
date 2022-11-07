import { RootState } from "../reducers";
import { AvailableLanguageI18nCode } from "../../../types/interface";

export const contentsSelector = (state: RootState) =>
  state.user.currentLanguagei18nCode
    ? state.contents[state.user.currentLanguagei18nCode]
    : [];

export const mostViewedContentsSelector =
  (langue: AvailableLanguageI18nCode) => (state: RootState) =>
    state.contents[langue]
      .sort((a, b) => b.nbVuesMobile - a.nbVuesMobile)
      .slice(0, 10);

export const nbContentsSelector = (state: RootState) => ({
  nbGlobalContent: state.contents.nbGlobalContent,
  nbLocalizedContent: state.contents.nbLocalizedContent,
});
