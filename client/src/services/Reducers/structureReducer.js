import { SET_STRUCTURES } from "../Structures/structures.actionTypes";

import { updateObject } from "../utility";

const initialState = {
  structures: [],
};

function structureReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STRUCTURES:
      return updateObject(state, { structures: action.value });
    default:
      return state;
  }
}

export default structureReducer;
