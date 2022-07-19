import { createReducer } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import { VoiceOverActions } from "./voiceOver.actions";

export interface VoiceOverState {
  readingList: Promise<ReadingItem>[];
  currentItem: ReadingItem | null;
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
    return {
      ...state,
      readingList: [...state.readingList, action.payload]
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
