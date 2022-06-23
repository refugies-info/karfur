import { action, ActionType } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import {
  ADD_READING,
  RESET_READING,
  READING_PAUSE,
  READING_RESUME,
  SCROLL_READING,
  SET_READING_ITEM
} from "./voiceOver.actionTypes";

export const pauseReading = () =>
  action(READING_PAUSE);
export const resumeReading = () =>
  action(READING_RESUME);
export const addToReadingList = (item: ReadingItem) =>
  action(ADD_READING, item);
export const resetReadingList = () =>
  action(RESET_READING);
export const setScrollReading = (y: number) =>
  action(SCROLL_READING, y);
export const setReadingItem = (itemId: string|null) =>
  action(SET_READING_ITEM, itemId);

const actions = {
  addToReadingList,
  resetReadingList,
  pauseReading,
  resumeReading,
  setScrollReading,
  setReadingItem
};

export type VoiceOverActions = ActionType<typeof actions>;
