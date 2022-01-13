import { RootState } from "../rootReducer";

export const ttsActiveSelector = (state: RootState): boolean =>
  state.tts.ttsActive;
