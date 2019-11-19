import * as actionTypes from './actionTypes';

export const toggleTTS = value => ({ type: actionTypes.TOGGLE_TTS });
export const toggleSpinner = value => ({ type: actionTypes.TOGGLE_SPINNER, value: value });