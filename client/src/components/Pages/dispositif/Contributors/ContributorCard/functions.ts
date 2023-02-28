import { SimpleUser } from "api-types";

export const getRole = (roles: SimpleUser["roles"]) => {
  if (!roles || roles.length === 0) return "Rédacteur";
  if (roles?.includes("Administrateur")) return "Admin";
  else if (roles.includes("Traducteur")) return "Traducteur";
  return "Rédacteur";
}
