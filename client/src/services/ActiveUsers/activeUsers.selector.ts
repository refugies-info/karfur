import { RootState } from "../rootReducer";
import { GetActiveUsersResponse } from "api-types";

export const activeUsersSelector = (
  state: RootState
): GetActiveUsersResponse[] => state.activeUsers;
