import { type ActionType, action } from "typesafe-actions";
import { SET_GROUPED_CONTENTS } from "./contentsGroupedByNeeds.actionTypes";

export const setGroupedContentsActionCreator = (value: Record<string, string[]>) =>
  action(SET_GROUPED_CONTENTS, value);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = {
  setGroupedContentsActionCreator,
};

export type GroupedContentsActions = ActionType<typeof actions>;
