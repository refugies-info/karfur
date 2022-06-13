import { createReducer } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import { VoiceOverActions } from "./voiceOver.actions";

export interface VoiceOverState {
  isReading: boolean;
  isPaused: boolean;
  rate: number;
  readingList: ReadingItem[];
  currentItem: string | null;
  currentScroll: number;
}

export const initialVoiceOverState = {
  isReading: false,
  isPaused: false,
  rate: 1,
  readingList: [],
  currentItem: null,
  currentScroll: 0
};

export const voiceOverReducer = createReducer<
  VoiceOverState,
  VoiceOverActions
>(initialVoiceOverState, {
  READING_START: (state) => {
    let index = 0;
    for (const [i, item] of state.readingList.entries()) {
      if (item.posY >= state.currentScroll) {
        index = i;
        break;
      }
    }
    return {
      ...state,
      isReading: state.readingList.length > 0,
      currentItem: state.readingList?.[index]?.id
    }
  },
  READING_STOP: (state) => ({
    ...state,
    isReading: false,
    currentItem: null
  }),
  READING_PAUSE: (state) => ({
    ...state,
    isPaused: true,
  }),
  READING_RESUME: (state) => ({
    ...state,
    isPaused: false,
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
  READING_PREVIOUS: (state) => {
    if (!state.currentItem || !state.isReading) return state;
    const currentItemIndex = state.readingList.findIndex(i => i.id === state.currentItem);
    const nextItem = state.readingList[currentItemIndex - 1];
    return {
      ...state,
      currentItem: nextItem?.id || null,
      isReading: !!nextItem?.id
    }
  },
  READING_RATE: (state) => ({
    ...state,
    rate: state.rate === 1 ? 1.2 : 1
  }),
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
  SCROLL_READING: (state, action) => ({
    ...state,
    currentScroll: action.payload
  }),
});
