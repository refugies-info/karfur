import { GetUserInfoResponse, RoleName } from "@refugies-info/api-types";

export const hasRole = (user: GetUserInfoResponse | undefined | null, roleName: RoleName): boolean => (
  (user?.roles || []).some(role => role.nom === roleName)
)
