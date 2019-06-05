import * as actionTypes from './actionTypes';
import API from '../../utils/API';

const set_dispositifs = (value) => {
  return {
    type: actionTypes.SET_DISPOSITIFS,
    value: value
  }
};

export const fetch_dispositifs = () => {
  return dispatch => {
    return API.get_dispositif({ status:'Actif'}).then(data => {
      return  dispatch(set_dispositifs(data.data.data));
    })
  };
};