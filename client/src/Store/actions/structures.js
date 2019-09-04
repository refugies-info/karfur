import * as actionTypes from './actionTypes';
import API from '../../utils/API';

const set_structures = (value) => {
  return {
    type: actionTypes.SET_STRUCTURES,
    value: value
  }
};

export const fetch_structures = () => {
  return dispatch => {
    return API.get_structure().then(data => {
      return  dispatch(set_structures(data.data.data));
    })
  };
};