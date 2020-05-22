import { SET_USER, UPDATE_USER } from "./user.actionTypes";
import API from "../../utils/API";

export const setUserActionCreator = (value) => {
  return {
    type: SET_USER,
    value: value,
  };
};

export const updateUserActionCreator = (value) => ({
  type: UPDATE_USER,
  value: value,
});

// TO DO : transform in saga
export const fetch_user = () => {
  return (dispatch) => {
    if (API.isAuth()) {
      return API.get_user_info().then((data) => {
        return dispatch(setUserActionCreator(data.data.data));
      });
    } else {
      return dispatch(setUserActionCreator({}));
    }
  };
};
