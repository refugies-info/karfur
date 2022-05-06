import { ObjectId } from "mongoose";
import { addLog } from "modules/logs/logs.service";

export const log = async (
  dispositifId: ObjectId,
  authorId: ObjectId
) => {
  await addLog(
    dispositifId,
    "Dispositif",
    "Note interne modifiée",
    { author: authorId }
  );
}
