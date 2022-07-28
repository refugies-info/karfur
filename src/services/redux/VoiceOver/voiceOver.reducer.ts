import { createReducer } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import { VoiceOverActions } from "./voiceOver.actions";

export interface VoiceOverState {
  readingList: Promise<ReadingItem>[]|null;
  currentItem: ReadingItem | null;
  currentScroll: number;
}

export const initialVoiceOverState = {
  readingList: null,
  currentItem: null,
  currentScroll: 0,
};

export const voiceOverReducer = createReducer<
  VoiceOverState,
  VoiceOverActions
>(initialVoiceOverState, {
  VOICEOVER_SET_READING_ITEM: (state, action) => ({
    ...state,
    currentItem: action.payload
  }),
  VOICEOVER_ADD_ITEM: (state, action) => {
    return {
      ...state,
      readingList: [...(state.readingList || []), action.payload]
    }
  },
  VOICEOVER_NEW_LIST: (state, action) => ({
    ...state,
    readingList: [],
    currentScroll: action.payload !== null ? action.payload : state.currentScroll
  }),
  VOICEOVER_RESET_LIST: (state) => ({
    ...state,
    readingList: null,
    currentItem: null,
    currentScroll: 0
  }),
  VOICEOVER_UPDATE_SCROLL: (state, action) => ({
    ...state,
    currentScroll: action.payload
  }),
});
