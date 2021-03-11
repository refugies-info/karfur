import { createReducer } from "typesafe-actions";
import { SelectedDispositifActions } from "./selectedDispositif.actions";
import { updateObject } from "../utility";
import _ from "lodash";
import { DispositifContent, IDispositif } from "../../types/interface";

interface UiElement {
  isHover: boolean;
  accordion: boolean;
  cardDropdown: boolean;
  addDropdown: boolean;
  varianteSelected: boolean;
  children?: UiElement[];
}

export type SelectedDispositifState = IDispositif & {
  uiArray: UiElement[];
};

const uiElement = {
  isHover: false,
  accordion: false,
  cardDropdown: false,
  addDropdown: false,
  varianteSelected: false,
};
const initialSelectedDispositifState = null;

export const selectedDispositifReducer = createReducer<
  SelectedDispositifState | null,
  SelectedDispositifActions
>(initialSelectedDispositifState, {
  SET_SELECTED_DISPOSITIF: (state, action) =>
    updateObject(state, {
      ...action.payload,
      // @ts-ignore
      uiArray: _.get(action.payload, "contenu", []).map(
        (x: DispositifContent) => {
          return {
            ...uiElement,
            ...(x.children && {
              children: new Array(x.children.length).fill({
                ...uiElement,
                accordion: action.payload.status === "Accepté structure",
              }),
            }),
          };
        }
      ),
    }),
  UPDATE_UI_ARRAY: (state, action) =>
    updateObject(state, {
      uiArray:
        state &&
        state.uiArray &&
        state.uiArray.map((x: any, idx: any) => {
          return {
            ...x,
            ...((action.payload.subkey === null &&
              idx === action.payload.key && {
                [action.payload.node]: action.payload.value,
              }) ||
              (action.payload.updateOthers && {
                [action.payload.node]: false,
              })),
            ...(x.children && {
              children: x.children.map((y: any, subidx: any) => {
                return {
                  ...y,
                  ...((subidx === action.payload.subkey &&
                    idx === action.payload.key && {
                      [action.payload.node]: action.payload.value,
                    }) ||
                    (action.payload.updateOthers && {
                      [action.payload.node]: false,
                    })),
                };
              }),
            }),
          };
        }),
    }),
  UPDATE_SELECTED_DISPOSITIF: (state, action) =>
    updateObject(state, { ...action.payload }),
  DELETE_TAG: (state, action) =>
    updateObject(state, {
      tags: state ? state.tags.filter((_, i) => i !== action.payload) : [],
    }),
});
