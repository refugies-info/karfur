import { action, ActionType } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import {
  READING_START,
  READING_STOP,
  READING_NEXT,
  READING_PREVIOUS,
  ADD_READING,
  RESET_READING,
  READING_RATE,
  READING_PAUSE,
  READING_RESUME,
  SCROLL_READING
} from "./voiceOver.actionTypes";

export const startReading = () =>
  action(READING_START);
export const stopReading = () =>
  action(READING_STOP);
export const pauseReading = () =>
  action(READING_PAUSE);
export const resumeReading = () =>
  action(READING_RESUME);
export const readNext = () =>
  action(READING_NEXT);
export const readPrevious = () =>
  action(READING_PREVIOUS);
export const readRate = () =>
  action(READING_RATE);
export const addToReadingList = (item: ReadingItem) =>
  action(ADD_READING, item);
export const resetReadingList = () =>
  action(RESET_READING);
export const setScrollReading = (y: number) =>
  action(SCROLL_READING, y);

const actions = {
  startReading,
  stopReading,
  readNext,
  readPrevious,
  addToReadingList,
  resetReadingList,
  readRate,
  pauseReading,
  resumeReading,
  setScrollReading
};

export type VoiceOverActions = ActionType<typeof actions>;
