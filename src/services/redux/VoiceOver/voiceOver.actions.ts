import { action, ActionType } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import {
  ADD_READING,
  RESET_READING,
  SCROLL_READING,
  SET_READING_ITEM,
  NEW_READING
} from "./voiceOver.actionTypes";

export const addToReadingList = (item: Promise<ReadingItem>) =>
  action(ADD_READING, item);
export const newReadingList = () =>
  action(NEW_READING);
export const resetReadingList = () =>
  action(RESET_READING);
export const setScrollReading = (y: number) =>
  action(SCROLL_READING, y);
export const setReadingItem = (item: ReadingItem|null) =>
  action(SET_READING_ITEM, item);

const actions = {
  addToReadingList,
  resetReadingList,
  setScrollReading,
  setReadingItem,
  newReadingList
};

export type VoiceOverActions = ActionType<typeof actions>;
