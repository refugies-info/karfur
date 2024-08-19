import { createReducer } from "typesafe-actions";
import { ReadingItem, ReadingObject } from "../../../types/interface";
import { VoiceOverActions } from "./voiceOver.actions";
import { MutableRefObject } from "react";

export interface VoiceOverState {
  readingList: Record<string, MutableRefObject<ReadingObject | undefined>> | null;
  currentItem: ReadingItem | null;
  currentScroll: number;
  shouldStop: boolean;
}

export const initialVoiceOverState = {
  readingList: null,
  currentItem: null,
  currentScroll: 0,
  shouldStop: false
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
      readingList: { ...(state.readingList || {}), [action.payload.id]: action.payload.item }
    }
  },
  VOICEOVER_REMOVE_ITEM: (state, action) => {
    const newReadingList = { ...(state.readingList || {}) };
    delete newReadingList[action.payload];
    return {
      ...state,
      readingList: newReadingList
    }
  },
  VOICEOVER_UPDATE_SCROLL: (state, action) => ({
    ...state,
    currentScroll: action.payload
  }),
  VOICEOVER_SHOULD_STOP: (state, action) => ({
    ...state,
    shouldStop: action.payload
  }),
});
