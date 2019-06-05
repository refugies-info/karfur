import * as actionTypes from './actionTypes';
import API from '../../utils/API';

const set_langues = (value) => {
  return {
    type: actionTypes.SET_LANGUES,
    value: value
  }
};

export const fetch_langues = () => {
  return dispatch => {
    return API.get_langues({},{avancement:-1, langueFr:1}).then(data => {
      return  dispatch(set_langues(data.data.data));
    })
  };
};

export const toggle_lang_modal = () => ({ type: actionTypes.TOGGLE_LANG_MODAL });
export const toggle_langue = value => ({ type: actionTypes.TOGGLE_LANGUE, value: value });