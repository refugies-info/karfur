import { GetDispositifResponse, GetUserInfoResponse } from "api-types";

export const canEdit = (dispositif: GetDispositifResponse | null, user: GetUserInfoResponse | null) => {
  if (!user || !dispositif) return false;
  if (user.contributions.includes(dispositif._id.toString())) return true;
  if (user.roles.find(r => r.nom === "Admin")) return true;
  if (dispositif.mainSponsor?._id && user.structures.includes(dispositif.mainSponsor._id.toString())) return true;
  return false;
}
