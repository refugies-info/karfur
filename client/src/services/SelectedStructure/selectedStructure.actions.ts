import {
  SET_SELECTED_STRUCTURE,
  FETCH_SELECTED_STRUCTURE,
  UPDATE_SELECTED_STRUCTURE
} from "./selectedStructure.actionTypes";
import { action, ActionType } from "typesafe-actions";
import { GetStructureResponse } from "@refugies-info/api-types";

export const setSelectedStructureActionCreator = (value: GetStructureResponse | null) =>
  action(SET_SELECTED_STRUCTURE, value);

export const fetchSelectedStructureActionCreator = (value: {
  id: string;
  locale: string;
}) => action(FETCH_SELECTED_STRUCTURE, value);

export const updateSelectedStructureActionCreator = (value: { locale: string }) =>
  action(UPDATE_SELECTED_STRUCTURE, value);

const actions = {
  setSelectedStructureActionCreator,
  fetchSelectedStructureActionCreator,
  updateSelectedStructureActionCreator,
};

export type SelectedStructureActions = ActionType<typeof actions>;
