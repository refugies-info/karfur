import {
  SET_LANGUES,
  TOGGLE_LANG_MODAL,
  TOGGLE_LANGUE,
} from "../Langue/langue.actionTypes";
import API from "../../utils/API";

const set_langues = (value) => {
  return {
    type: SET_LANGUES,
    value: value,
  };
};

export const fetch_langues = () => {
  return (dispatch) => {
    return API.get_langues({}, { avancement: -1, langueFr: 1 }).then((data) => {
      return dispatch(set_langues(data.data.data));
    });
  };
};

export const toggle_lang_modal = () => ({
  type: TOGGLE_LANG_MODAL,
});
export const toggle_langue = (value) => ({
  type: TOGGLE_LANGUE,
  value: value,
});
