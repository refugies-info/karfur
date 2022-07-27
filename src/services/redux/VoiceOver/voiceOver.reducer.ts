import { createReducer } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import { VoiceOverActions } from "./voiceOver.actions";

export interface VoiceOverState {
  readingList: Promise<ReadingItem>[]|null;
  currentItem: ReadingItem | null;
  currentScroll: number;
  parentRef: any
}

export const initialVoiceOverState = {
  readingList: null,
  currentItem: null,
  currentScroll: 0,
  parentRef: null // used to calculate position of elements
};

export const voiceOverReducer = createReducer<
  VoiceOverState,
  VoiceOverActions
>(initialVoiceOverState, {
  VOICEOVER_SET_REF: (state, action) => ({
    ...state,
    parentRef: action.payload
  }),
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
  VOICEOVER_NEW_LIST: (state) => ({
    ...state,
    readingList: [],
    currentScroll: 0
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
