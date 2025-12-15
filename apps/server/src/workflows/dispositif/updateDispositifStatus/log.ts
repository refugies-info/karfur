import { addLog } from "~/modules/logs/logs.service";
import { type DispositifId, ObjectId, type UserId } from "~/typegoose";

export const log = async (dispositifId: DispositifId, status: string, authorId: UserId) => {
  await addLog(dispositifId, "Dispositif", "Statut modifié : " + status, {
    author: new ObjectId(authorId),
  });
};
