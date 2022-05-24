import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (
  structureId: ObjectId,
  authorId: ObjectId,
) => {
  await addLog(
    structureId,
    "Structure",
    "La structure est créée",
    { author: authorId }
  );
}
