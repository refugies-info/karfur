import {
  SET_SELECTED_STRUCTURE,
  FETCH_SELECTED_STRUCTURE,
} from "./selectedStructure.actionTypes";
import { Structure } from "../../@types/interface";
import { action, ActionType } from "typesafe-actions";
import { ObjectId } from "mongodb";

export const setSelectedStructureActionCreator = (value: Structure | null) =>
  action(SET_SELECTED_STRUCTURE, value);

export const fetchSelectedStructureActionCreator = (id: ObjectId) =>
  action(FETCH_SELECTED_STRUCTURE, id);

const actions = {
  setSelectedStructureActionCreator,
  fetchSelectedStructureActionCreator,
};

export type SelectedStructureActions = ActionType<typeof actions>;
