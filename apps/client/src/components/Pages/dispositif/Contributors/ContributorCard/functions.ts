import { RoleName, SimpleUser } from "@refugies-info/api-types";

export const getRole = (roles: SimpleUser["roles"]) => {
  if (!roles || roles.length === 0) return "redactor";
  if (roles?.includes(RoleName.ADMIN)) return "admin";
  else if (roles.includes(RoleName.TRAD) || roles.includes(RoleName.EXPERT_TRAD)) return "translator";
  return "redactor";
}
