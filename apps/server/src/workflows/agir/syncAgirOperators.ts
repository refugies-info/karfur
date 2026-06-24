import type { AgirOperatorsSyncResponse } from "@refugies-info/api-types";

export const syncAgirOperators = async (): Promise<AgirOperatorsSyncResponse> => ({
  success: true,
  status: "ready",
  message: "AGIR operators sync route is reachable by admin users",
});
