import { action, ActionType } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import {
  VOICEOVER_ADD_ITEM,
  VOICEOVER_RESET_LIST,
  VOICEOVER_UPDATE_SCROLL,
  VOICEOVER_SET_READING_ITEM,
  VOICEOVER_NEW_LIST,
  VOICEOVER_EDIT_ITEM,
} from "./voiceOver.actionTypes";

export const addToReadingList = (data: { item: Promise<ReadingItem>, id: string }) =>
  action(VOICEOVER_ADD_ITEM, data);
export const editReadingListItem = (data: { item: Promise<ReadingItem>, id: string }) =>
  action(VOICEOVER_EDIT_ITEM, data);
export const newReadingList = (currentScroll: number | null) =>
  action(VOICEOVER_NEW_LIST, currentScroll);
export const resetReadingList = () =>
  action(VOICEOVER_RESET_LIST);
export const setScrollReading = (y: number) =>
  action(VOICEOVER_UPDATE_SCROLL, y);
export const setReadingItem = (item: ReadingItem | null) =>
  action(VOICEOVER_SET_READING_ITEM, item);

const actions = {
  addToReadingList,
  editReadingListItem,
  resetReadingList,
  setScrollReading,
  setReadingItem,
  newReadingList
};

export type VoiceOverActions = ActionType<typeof actions>;
