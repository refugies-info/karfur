import { action, ActionType } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import {
  READING_START,
  READING_STOP,
  READING_NEXT,
  ADD_READING,
  RESET_READING,
} from "./voiceOver.actionTypes";

export const startReading = () =>
  action(READING_START);
export const stopReading = () =>
  action(READING_STOP);
export const readNext = () =>
  action(READING_NEXT);
export const addToReadingList = (item: ReadingItem) =>
  action(ADD_READING, item);
export const resetReadingList = () =>
  action(RESET_READING);

const actions = {
  startReading,
  stopReading,
  readNext,
  addToReadingList,
  resetReadingList
};

export type VoiceOverActions = ActionType<typeof actions>;
