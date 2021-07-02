import { RootState } from "../reducers";

export const selectedContentSelector = (state: RootState) =>
  state.selectedContent;
