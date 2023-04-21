import { GetDispositifResponse, GetUserInfoResponse } from "api-types";

export const canEdit = (dispositif: GetDispositifResponse, user: GetUserInfoResponse | null) => {
  if (!user) return false;
  if (user.contributions.includes(dispositif._id.toString())) return true;
  if (user.roles.find(r => r.nom === "Admin")) return true;
  // TODO: if structure responsable ?
  return false;
}
