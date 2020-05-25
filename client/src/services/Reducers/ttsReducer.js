import { TOGGLE_SPINNER, TOGGLE_TTS } from "../Tts/tts.actionTypes";
import { updateObject } from "../utility";

const initialState = { ttsActive: false, showAudioSpinner: false };

function ttsReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_TTS:
      return updateObject(state, {
        ttsActive: !state.ttsActive,
        showAudioSpinner: false,
      });
    case TOGGLE_SPINNER:
      return updateObject(state, { showAudioSpinner: action.value });
    default:
      return state;
  }
}

export default ttsReducer;
