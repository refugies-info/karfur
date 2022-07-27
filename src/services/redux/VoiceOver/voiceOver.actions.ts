import React from "react";
import { View } from "react-native";
import { action, ActionType } from "typesafe-actions";
import { ReadingItem } from "../../../types/interface";
import {
  VOICEOVER_ADD_ITEM,
  VOICEOVER_RESET_LIST,
  VOICEOVER_UPDATE_SCROLL,
  VOICEOVER_SET_READING_ITEM,
  VOICEOVER_NEW_LIST,
  VOICEOVER_SET_REF
} from "./voiceOver.actionTypes";

export const addToReadingList = (item: Promise<ReadingItem>) =>
  action(VOICEOVER_ADD_ITEM, item);
export const newReadingList = () =>
  action(VOICEOVER_NEW_LIST);
export const resetReadingList = () =>
  action(VOICEOVER_RESET_LIST);
export const setScrollReading = (y: number) =>
  action(VOICEOVER_UPDATE_SCROLL, y);
export const setReadingItem = (item: ReadingItem|null) =>
  action(VOICEOVER_SET_READING_ITEM, item);
export const setRef = (ref: React.MutableRefObject<View | null>) =>
  action(VOICEOVER_SET_REF, ref);

const actions = {
  addToReadingList,
  resetReadingList,
  setScrollReading,
  setReadingItem,
  newReadingList,
  setRef
};

export type VoiceOverActions = ActionType<typeof actions>;
