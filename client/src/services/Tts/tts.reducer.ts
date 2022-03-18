import { createReducer } from "typesafe-actions";
import { TtsActions } from "./tts.actions";

export interface TtsState {
  ttsActive: boolean;
  showAudioSpinner: boolean;
}

const initialTtsState: TtsState = { ttsActive: false, showAudioSpinner: false };

export const ttsReducer = createReducer<TtsState, TtsActions>(initialTtsState, {
  TOGGLE_TTS: (state) =>
    ({... state,
      ttsActive: !state.ttsActive,
      showAudioSpinner: false,
    }),
  TOGGLE_SPINNER: (state, action) =>
    ({... state, showAudioSpinner: action.payload }),
});
