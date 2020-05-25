import { TOGGLE_TTS, TOGGLE_SPINNER } from "../Tts/tts.actionTypes";
import { action, ActionType } from "typesafe-actions";

export const toggleTTSActionCreator = () => action(TOGGLE_TTS);
export const toggleSpinner = (value: boolean) => action(TOGGLE_SPINNER, value);

const actions = { toggleSpinner, toggleTTSActionCreator };

export type TtsActions = ActionType<typeof actions>;
