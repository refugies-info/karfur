import type { GetActiveUsersResponse } from "@refugies-info/api-types";
import type { RootState } from "../rootReducer";

export const activeUsersSelector = (state: RootState): GetActiveUsersResponse[] =>
  state.activeUsers;
