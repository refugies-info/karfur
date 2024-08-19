import { RootState } from "../reducers";

export const readingListSelector = (state: RootState) =>
  state.voiceOver.readingList;

export const readingListLengthSelector = (state: RootState) =>
  Object.keys(state.voiceOver.readingList || {}).length;

export const currentItemSelector = (state: RootState) =>
  state.voiceOver.currentItem;

export const currentScrollSelector = (state: RootState) =>
  state.voiceOver.currentScroll;

export const shouldStopSelector = (state: RootState) =>
  state.voiceOver.shouldStop;
