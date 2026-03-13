import type { Dispositif, DispositifId, UserId } from "@refugies-info/mongo";
import { addLog } from "~/modules/logs/logs.service";

export const log = async (
  dispositifId: DispositifId,
  dispositif: Partial<Dispositif>,
  oldDispositif: Dispositif,
  authorId: UserId,
) => {
  const newComments = dispositif.adminComments || "";
  const oldComments = oldDispositif.adminComments || "";
  if (newComments !== oldComments) {
    await addLog(dispositifId, "Dispositif", "Note interne modifiée", { author: authorId });
  }
};
