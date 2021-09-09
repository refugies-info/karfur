import { RootState } from "../reducers";

export const groupedContentsSelector = () => (state: RootState) =>
  state.groupedContents;
