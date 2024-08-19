import { StructureId, UserId } from "../../../typegoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (structureId: StructureId, authorId: UserId) => {
  await addLog(structureId, "Structure", "La structure est créée", { author: authorId });
};
