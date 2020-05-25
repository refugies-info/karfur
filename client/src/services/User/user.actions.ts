import { SET_USER, UPDATE_USER } from "./user.actionTypes";
import API from "../../utils/API";
import { RequestReturn, User } from "../../@types/interface";

export const setUserActionCreator = (value: User | {}) => {
  return {
    type: SET_USER,
    value: value,
  };
};

export const updateUserActionCreator = (value: User) => ({
  type: UPDATE_USER,
  value: value,
});

// TO DO : transform in saga
export const fetch_user = () => {
  return (dispatch: any) => {
    if (API.isAuth()) {
      return API.get_user_info().then((data: RequestReturn<User>) => {
        return dispatch(setUserActionCreator(data.data.data));
      });
    } else {
      return dispatch(setUserActionCreator({}));
    }
  };
};
