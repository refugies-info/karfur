import { RootState } from "../reducers";

export const isReadingSelector = (state: RootState) =>
  state.voiceOver.isReading;

export const isPausedSelector = (state: RootState) =>
  state.voiceOver.isPaused;

export const readingRateSelector = (state: RootState) =>
  state.voiceOver.rate;

export const readingList = (state: RootState) =>
  state.voiceOver.readingList;

export const currentItemId = (state: RootState) =>
  state.voiceOver.currentItem;

export const currentItem = (state: RootState) => {
  return state.voiceOver.readingList.find(item => item.id === state.voiceOver.currentItem);
}
