import * as actions from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  structures: [],
};

function structureReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STRUCTURES:
      return updateObject(state, { structures: action.value });
    default:
      return state;
  }
}

export default structureReducer;
