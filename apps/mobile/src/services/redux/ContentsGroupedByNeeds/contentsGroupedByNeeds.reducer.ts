import { createReducer } from "typesafe-actions";
import type { GroupedContentsActions } from "./contentsGroupedByNeeds.actions";

export type GroupedContentsState = Record<string, string[]>;

export const initialGroupedContentsState = {};

export const groupedContentsReducer = createReducer<GroupedContentsState, GroupedContentsActions>(
  initialGroupedContentsState,
  {
    SET_GROUPED_CONTENTS: (_, action) => action.payload,
  },
);
