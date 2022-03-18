import { RootState } from "../rootReducer";

export const ttsActiveSelector = (state: RootState): boolean =>
  state.tts.ttsActive;

export const ttsLoadingSelector = (state: RootState): boolean =>
  state.tts.showAudioSpinner;
