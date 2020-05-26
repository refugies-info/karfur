// example file
export {};

import { SET_DISPOSITIFS } from "../Dispositif/dispositif.actionTypes";
import API from "../../utils/API";
import { ActionType, action } from "typesafe-actions";
import { Dispositif } from "../../@types/interface";

const setDispositifsActionsCreator = (value: Dispositif[]) =>
  action(SET_DISPOSITIFS, value);

export const fetch_dispositifs = () => {
  return (dispatch: any) => {
    return API.get_dispositif({
      query: { status: "Actif" },
      demarcheId: { $exists: false },
    }).then((data: any) => {
      return dispatch(setDispositifsActionsCreator(data.data.data));
    });
  };
};

const actions = {
  setDispositifsActionsCreator,
  // fetchDispositifsActionCreator,
};

export type DispositifActions = ActionType<typeof actions>;
