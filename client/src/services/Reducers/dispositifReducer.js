import { SET_DISPOSITIFS } from "../Dispositifs/dispositifs.actionTypes";
import { updateObject } from "../utility";

const initialState = {
  dispositifs: [],
};

function dispositifReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DISPOSITIFS:
      return updateObject(state, { dispositifs: action.value });
    default:
      return state;
  }
}

export default dispositifReducer;
