import { RootState } from "services/rootReducer";

export const showNewsletterModalSelector = (state: RootState): boolean => state.miscellaneous.showNewsletterModal;
