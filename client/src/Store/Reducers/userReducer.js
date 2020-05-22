// Store/Reducers/langueReducer.js
import * as actions from "../actions/actionTypes";
import { updateObject } from "../utility";

//A changer, c'est juste pour l'exemple
const initialState = {
  user: {},
  admin: false,
  traducteur: false,
  expertTrad: false,
  contributeur: false,
  membreStruct: false,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_USER:
      return updateObject(state, {
        user: action.value,
        userId: (action.value || {})._id,
        admin: ((action.value || {}).roles || []).some(
          (x) => x.nom === "Admin"
        ),
        traducteur: ((action.value || {}).roles || []).some(
          (x) => x.nom === "Trad"
        ),
        expertTrad: ((action.value || {}).roles || []).some(
          (x) => x.nom === "ExpertTrad"
        ),
        contributeur: ((action.value || {}).roles || []).some(
          (x) => x.nom === "Contrib"
        ),
        membreStruct: ((action.value || {}).roles || []).some(
          (x) => x.nom === "hasStructure"
        ),
      });
    case actions.UPDATE_USER:
      return updateObject(state, { user: action.value });
    default:
      return state;
  }
}

export default userReducer;
