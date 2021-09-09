import { ObjectId } from "../../../types/interface";
import { createReducer } from "typesafe-actions";
import { GroupedContentsActions } from "./contentsGroupedByNeeds.actions";

export type GroupedContentsState = Record<ObjectId, ObjectId[]>;

export const initialGroupedContentsState = {};

export const groupedContentsReducer = createReducer<
  GroupedContentsState,
  GroupedContentsActions
>(initialGroupedContentsState, {
  SET_GROUPED_CONTENTS: (state, action) => action.payload,
});
