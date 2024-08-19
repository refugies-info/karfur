import { SET_GROUPED_CONTENTS } from "./contentsGroupedByNeeds.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { ObjectId } from "../../../types/interface";

export const setGroupedContentsActionCreator = (
  value: Record<ObjectId, ObjectId[]>
) => action(SET_GROUPED_CONTENTS, value);

const actions = {
  setGroupedContentsActionCreator,
};
export type GroupedContentsActions = ActionType<typeof actions>;
