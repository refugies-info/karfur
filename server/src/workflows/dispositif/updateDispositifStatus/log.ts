import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (
  dispositifId: ObjectId,
  status: string,
  authorId: ObjectId,
) => {
  await addLog(
    dispositifId,
    "Dispositif",
    "Statut modifié : " + status,
    { author: authorId }
  );
}
