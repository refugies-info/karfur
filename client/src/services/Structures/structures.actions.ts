import { SET_STRUCTURES } from "../Structures/structures.actionTypes";
import API from "../../utils/API";
import { Structure } from "../../@types/interface";
import { action, ActionType } from "typesafe-actions";

const setStructureActionCreator = (value: Structure[]) =>
  action(SET_STRUCTURES, value);

// TO DO saga
export const fetch_structures = () => {
  return (dispatch: any) => {
    return API.get_structure({ status: "Actif" }).then((data: any) => {
      return dispatch(setStructureActionCreator(data.data.data));
    });
  };
};

const actions = {
  setStructureActionCreator,
  fetch_structures,
};

export type StructureActions = ActionType<typeof actions>;
