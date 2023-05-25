import { DispositifStatus, GetDispositifResponse, GetUserInfoResponse } from "@refugies-info/api-types";
import { isNotStatus } from "./isStatus";

export const canEdit = (dispositif: GetDispositifResponse | null, user: GetUserInfoResponse | null) => {
  if (!user || !dispositif) return false;
  if (user.contributions.includes(dispositif._id.toString())) return true;
  if (user.roles.find(r => r.nom === "Admin")) return true;

  const isFromStructure = dispositif.mainSponsor?._id && user.structures.includes(dispositif.mainSponsor._id.toString());
  if (isFromStructure && isNotStatus(dispositif.status, [DispositifStatus.KO_STRUCTURE, DispositifStatus.WAITING_STRUCTURE])) return true;
  return false;
}
