import { createReducer } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import { VoiceOverActions } from "./voiceOver.actions";

export interface VoiceOverState {
  isReading: boolean;
  readingList: ReadingItem[];
  currentItem: string | null ;
}

export const initialVoiceOverState = {
  isReading: false,
  readingList: [],
  currentItem: null
};

export const voiceOverReducer = createReducer<
  VoiceOverState,
  VoiceOverActions
>(initialVoiceOverState, {
  READING_START: (state) => ({
    ...state,
    isReading: state.readingList.length > 0,
    currentItem: state.readingList?.[0]?.id
  }),
  READING_STOP: (state) => ({
    ...state,
    isReading: false,
    currentItem: null
  }),
  READING_NEXT: (state) => {
    if (!state.currentItem || !state.isReading) return state;
    const currentItemIndex = state.readingList.findIndex(i => i.id === state.currentItem);
    const nextItem = state.readingList[currentItemIndex + 1];
    return {
      ...state,
      currentItem: nextItem?.id || null,
      isReading: !!nextItem?.id
    }
  },
  ADD_READING: (state, action) => {
    const newList = [...state.readingList, action.payload].sort((a, b) => {
      if (a.posY < b.posY) return -1;
      else if (a.posY > b.posY) return 1;
      else if (a.posX < b.posY) -1; // is same horizontal position, check vertical position
      return 1;
    })
    return {
      ...state,
      readingList: newList
    }
  },
  RESET_READING: (state) => ({
    ...state,
    readingList: []
  }),
});
