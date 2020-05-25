import { SET_STRUCTURES } from "../Structures/structures.actionTypes";
import API from "../../utils/API";

const set_structures = (value) => {
  return {
    type: SET_STRUCTURES,
    value: value,
  };
};

export const fetch_structures = () => {
  return (dispatch) => {
    return API.get_structure({ status: "Actif" }).then((data) => {
      return dispatch(set_structures(data.data.data));
    });
  };
};
