import { RootState } from "../reducers";

export const readingListSelector = (state: RootState) =>
  state.voiceOver.readingList;

export const currentItemId = (state: RootState) =>
  state.voiceOver.currentItem;

export const currentItemSelector = (state: RootState) => {
  return state.voiceOver.readingList.find(item => item.id === state.voiceOver.currentItem);
}

export const currentScrollSelector = (state: RootState) =>
    state.voiceOver.currentScroll;
