import { DispositifStatus, GetDispositifResponse, GetUserInfoResponse, RoleName } from "@refugies-info/api-types";
import { hasRole } from "lib/hasRole";
import { isStatus } from "./isStatus";

export const canEdit = (dispositif: GetDispositifResponse | null, user: GetUserInfoResponse | null) => {
  if (!user || !dispositif) return false;
  if (hasRole(user, RoleName.ADMIN)) return true;

  const firstDraftVersion = isStatus(dispositif.status, DispositifStatus.DRAFT); // the never published draft
  const authorCanModify = [ // or waiting content
    DispositifStatus.WAITING_STRUCTURE,
    DispositifStatus.KO_STRUCTURE,
  ];
  const isEditableByAuthor = firstDraftVersion || authorCanModify.includes(dispositif.status);
  const isAuthor = dispositif.creatorId?._id.toString() === user._id.toString();
  if (isEditableByAuthor && isAuthor) {
    return true;
  }

  const isFromStructure = dispositif.mainSponsor?._id && user.structures.includes(dispositif.mainSponsor?._id.toString());
  if (isFromStructure) {
    return true;
  }

  return false;
}
