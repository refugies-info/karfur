import { DispositifId, Id, UserId } from "src/typegoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (dispositifId: DispositifId, status: string, authorId: UserId) => {
  await addLog(dispositifId, "Dispositif", "Statut modifié : " + status, { author: new Id(authorId) });
};
