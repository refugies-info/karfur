import {
  SET_SELECTED_STRUCTURE,
  FETCH_SELECTED_STRUCTURE,
} from "./selectedStructure.actionTypes";
import { Structure } from "../../@types/interface";
import { action, ActionType } from "typesafe-actions";
import { ObjectId } from "mongodb";

export const setSelectedStructureActionCreator = (value: Structure | null) =>
  action(SET_SELECTED_STRUCTURE, value);

export const fetchSelectedStructureActionCreator = (value: {
  id: ObjectId;
  locale: string;
}) => action(FETCH_SELECTED_STRUCTURE, value);

const actions = {
  setSelectedStructureActionCreator,
  fetchSelectedStructureActionCreator,
};

export type SelectedStructureActions = ActionType<typeof actions>;
