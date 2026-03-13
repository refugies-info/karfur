import { type DispositifId, ObjectId, type UserId } from "@refugies-info/mongo";
import { addLog } from "~/modules/logs/logs.service";

export const log = async (dispositifId: DispositifId, status: string, authorId: UserId) => {
  await addLog(dispositifId, "Dispositif", "Statut modifié : " + status, {
    author: new ObjectId(authorId),
  });
};
