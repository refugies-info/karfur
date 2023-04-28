import { createReducer } from "typesafe-actions";
import { AllStructuresActions } from "./allStructures.actions";
import { GetAllStructuresResponse } from "api-types";

export type AllStructuresState = GetAllStructuresResponse[];

export const initialAllStructuresState: AllStructuresState = [];

export const allStructuresReducer = createReducer<
  AllStructuresState,
  AllStructuresActions
>(initialAllStructuresState, {
  SET_ALL_STRUCTURES: (_, action) => action.payload,
  ADD_TO_ALL_STRUCTURES: (state, action) => {
    return [...state, {
      _id: "",
      nom: "",
      nbMembres: 0,
      createur: null,
      responsable: null,
      membres: [],
      dispositifsIds: [],
      nbFiches: 0,
      ...action.payload
    }]
  }
});
