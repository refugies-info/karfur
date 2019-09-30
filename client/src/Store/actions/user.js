import * as actionTypes from './actionTypes';
import API from '../../utils/API';

const set_user = (value) => {
  return {
    type: actionTypes.SET_USER,
    value: value
  }
};

export const fetch_user = () => {
  return dispatch => {
    if(API.isAuth()){
      return API.get_user_info().then(data => {
        return  dispatch(set_user(data.data.data));
      })
    }else{ return false; }
  };
};

export const update_user = value => ({ type: actionTypes.UPDATE_USER, value: value });