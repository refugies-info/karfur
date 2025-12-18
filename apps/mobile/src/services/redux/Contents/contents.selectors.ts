import type { Languages } from "@refugies-info/api-types";
import { createSelector } from "reselect";
import type { RootState } from "../reducers";

export const contentsSelector = (state: RootState) =>
  state.user.currentLanguagei18nCode ? state.contents[state.user.currentLanguagei18nCode] : [];

export const contentSelector = (id: string) => (state: RootState) =>
  contentsSelector(state).find((content) => content._id.toString() === id);

export const mostViewedContentsSelector = (langue: Languages) => (state: RootState) =>
  state.contents[langue].sort((a, b) => b.nbVuesMobile - a.nbVuesMobile).slice(0, 10);

const nbGlobalContentSelector = (state: RootState) => state.contents.nbGlobalContent;
const nbLocalizedContentSelector = (state: RootState) => state.contents.nbLocalizedContent;

export const nbContentsSelector = createSelector(
  [nbGlobalContentSelector, nbLocalizedContentSelector],
  (nbGlobalContent, nbLocalizedContent) => ({
    nbGlobalContent,
    nbLocalizedContent,
  }),
);
