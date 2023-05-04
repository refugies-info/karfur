import { DispositifId, ObjectId, UserId } from "../../../typegoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (dispositifId: DispositifId, status: string, authorId: UserId) => {
  await addLog(dispositifId, "Dispositif", "Statut modifié : " + status, { author: new ObjectId(authorId) });
};
