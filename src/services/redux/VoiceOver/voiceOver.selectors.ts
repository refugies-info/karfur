import { RootState } from "../reducers";

export const isReadingSelector = (state: RootState) =>
  state.voiceOver.isReading;

export const readingList = (state: RootState) =>
  state.voiceOver.readingList;

export const currentItem = (state: RootState) =>
  state.voiceOver.currentItem;
