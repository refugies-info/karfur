import { SET_USER, UPDATE_USER } from "./user.actionTypes";

import API from "../../utils/API";

const set_user = (value) => {
  return {
    type: SET_USER,
    value: value,
  };
};

export const fetch_user = () => {
  return (dispatch) => {
    if (API.isAuth()) {
      return API.get_user_info().then((data) => {
        return dispatch(set_user(data.data.data));
      });
    } else {
      return dispatch(set_user({}));
    }
  };
};

export const update_user = (value) => ({
  type: UPDATE_USER,
  value: value,
});
