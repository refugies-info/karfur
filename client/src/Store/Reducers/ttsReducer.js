import * as actions from '../actions/actions'

const initialState = { ttsActive: false }

function ttsReducer(state = initialState, action) {
  let nextState
  switch (action.type) {
    case actions.TOGGLE_TTS:
      nextState = {
        ...state,
        ttsActive: !state.ttsActive
      }
      return nextState || state
  default:
    return state
  }
}

export default ttsReducer;