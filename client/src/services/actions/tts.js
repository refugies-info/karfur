import { TOGGLE_TTS, TOGGLE_SPINNER } from "../Tts/tts.actionTypes";

export const toggleTTS = () => ({ type: TOGGLE_TTS });
export const toggleSpinner = (value) => ({
  type: TOGGLE_SPINNER,
  value: value,
});
