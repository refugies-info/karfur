import { action, ActionType } from "typesafe-actions";
import { TOGGLE_NEWSLETTER_MODAL } from "./miscellaneous.actionTypes";

export const toggleNewsletterModalAction = (visible?: boolean) => action(TOGGLE_NEWSLETTER_MODAL, visible);

const actions = {
  toggleNewsletterModalAction
};
export type MiscellaneousActions = ActionType<typeof actions>;
