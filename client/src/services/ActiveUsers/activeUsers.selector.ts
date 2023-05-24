import { RootState } from "../rootReducer";
import { GetActiveUsersResponse } from "@refugies-info/api-types";

export const activeUsersSelector = (
  state: RootState
): GetActiveUsersResponse[] => state.activeUsers;
