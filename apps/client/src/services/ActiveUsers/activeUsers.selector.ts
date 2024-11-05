import { GetActiveUsersResponse } from "@refugies-info/api-types";
import { RootState } from "../rootReducer";

export const activeUsersSelector = (state: RootState): GetActiveUsersResponse[] => state.activeUsers;
