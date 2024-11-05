import { action, ActionType } from "typesafe-actions";
import { TOGGLE_SPINNER, TOGGLE_TTS } from "../Tts/tts.actionTypes";

export const toggleTTSActionCreator = () => action(TOGGLE_TTS);
export const toggleSpinner = (value: boolean) => action(TOGGLE_SPINNER, value);

const actions = { toggleSpinner, toggleTTSActionCreator };

export type TtsActions = ActionType<typeof actions>;
