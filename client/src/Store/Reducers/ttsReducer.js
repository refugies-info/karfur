import * as actions from '../actions/actionTypes'
import { updateObject } from '../utility';

const initialState = { ttsActive: false }

function ttsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.TOGGLE_TTS:
      return updateObject(state, { ttsActive: !state.ttsActive })
    default:
      return state
  }
}

export default ttsReducer;