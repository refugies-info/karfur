import { createReducer } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import { VoiceOverActions } from "./voiceOver.actions";

export interface VoiceOverState {
  readingList: ReadingItem[];
  currentItem: string | null;
  currentScroll: number;
}

export const initialVoiceOverState = {
  readingList: [],
  currentItem: null,
  currentScroll: 0
};

export const voiceOverReducer = createReducer<
  VoiceOverState,
  VoiceOverActions
>(initialVoiceOverState, {
  SET_READING_ITEM: (state, action) => ({
    ...state,
    currentItem: action.payload
  }),
  ADD_READING: (state, action) => {
    const newList = state.readingList.find(i => i.id === action.payload.id) ?
      [...state.readingList] : // if already in list, do not add again
      [...state.readingList, action.payload];
    return {
      ...state,
      readingList: newList
    }
  },
  RESET_READING: (state) => ({
    ...state,
    readingList: [],
    isReading: false,
    isPaused: false,
    currentItem: null,
    currentScroll: 0
  }),
  SCROLL_READING: (state, action) => ({
    ...state,
    currentScroll: action.payload
  }),
});
