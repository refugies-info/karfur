import { SimpleUser } from "api-types";

export const getRole = (roles: SimpleUser["roles"]) => {
  if (!roles || roles.length === 0) return "Rédacteur";
  if (roles?.includes("Admin")) return "Admin";
  else if (roles.includes("Trad") || roles.includes("ExpertTrad")) return "Traducteur";
  return "Rédacteur";
}
