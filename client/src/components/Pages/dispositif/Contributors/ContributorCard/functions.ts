import { SimpleUser } from "@refugies-info/api-types";

export const getRole = (roles: SimpleUser["roles"]) => {
  if (!roles || roles.length === 0) return "redactor";
  if (roles?.includes("Admin")) return "admin";
  else if (roles.includes("Trad") || roles.includes("ExpertTrad")) return "translator";
  return "redactor";
}
