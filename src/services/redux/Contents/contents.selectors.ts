import { Languages } from "@refugies-info/api-types";
import { RootState } from "../reducers";

export const contentsSelector = (state: RootState) =>
  state.user.currentLanguagei18nCode
    ? state.contents[state.user.currentLanguagei18nCode]
    : [];

export const contentSelector = (id: string) => (state: RootState) =>
  contentsSelector(state).find((content) => content._id.toString() === id);

export const mostViewedContentsSelector =
  (langue: Languages) => (state: RootState) =>
    state.contents[langue]
      .sort((a, b) => b.nbVuesMobile - a.nbVuesMobile)
      .slice(0, 10);

export const nbContentsSelector = (state: RootState) => ({
  nbGlobalContent: state.contents.nbGlobalContent,
  nbLocalizedContent: state.contents.nbLocalizedContent,
});
