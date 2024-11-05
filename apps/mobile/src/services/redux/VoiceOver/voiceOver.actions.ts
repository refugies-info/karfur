import { MutableRefObject } from "react";
import { action, ActionType } from "typesafe-actions";
import { ReadingItem, ReadingObject } from "~/types/interface";
import {
  VOICEOVER_ADD_ITEM,
  VOICEOVER_REMOVE_ITEM,
  VOICEOVER_SET_READING_ITEM,
  VOICEOVER_SHOULD_STOP,
  VOICEOVER_UPDATE_SCROLL,
} from "./voiceOver.actionTypes";

export const addToReadingList = (data: { item: MutableRefObject<ReadingObject | undefined>; id: string }) =>
  action(VOICEOVER_ADD_ITEM, data);
export const removeFromReadingList = (id: string) => action(VOICEOVER_REMOVE_ITEM, id);
export const setScrollReading = (y: number) => action(VOICEOVER_UPDATE_SCROLL, y);
export const setReadingItem = (item: ReadingItem | null) => action(VOICEOVER_SET_READING_ITEM, item);
export const setShouldStop = (shouldStop: boolean) => action(VOICEOVER_SHOULD_STOP, shouldStop);

const actions = {
  addToReadingList,
  removeFromReadingList,
  setScrollReading,
  setReadingItem,
  setShouldStop,
};

export type VoiceOverActions = ActionType<typeof actions>;
