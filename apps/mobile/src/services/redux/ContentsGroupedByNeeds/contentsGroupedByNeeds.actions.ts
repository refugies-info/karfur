import { action, ActionType } from "typesafe-actions";
import { ObjectId } from "~/types/interface";
import { SET_GROUPED_CONTENTS } from "./contentsGroupedByNeeds.actionTypes";

export const setGroupedContentsActionCreator = (value: Record<ObjectId, ObjectId[]>) =>
  action(SET_GROUPED_CONTENTS, value);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = {
  setGroupedContentsActionCreator,
};

export type GroupedContentsActions = ActionType<typeof actions>;
