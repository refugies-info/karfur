import { MiscellaneousActions } from "./miscellaneous.actions";
import { createReducer } from "typesafe-actions";
import { TOGGLE_NEWSLETTER_MODAL } from "./miscellaneous.actionTypes";

export interface MiscellaneousState {
  showNewsletterModal: boolean;
}

const initialMiscellaneousState = {
  showNewsletterModal: false
};

export const miscellaneousReducer = createReducer<MiscellaneousState, MiscellaneousActions>(initialMiscellaneousState, {
  [TOGGLE_NEWSLETTER_MODAL]: (state, action) => ({
    ...state,
    showNewsletterModal: action.payload || !state.showNewsletterModal
  })
});
