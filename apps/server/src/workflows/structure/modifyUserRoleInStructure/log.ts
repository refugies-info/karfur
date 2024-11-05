import { addLog } from "~/modules/logs/logs.service";
import { StructureId, UserId } from "~/typegoose";

export const log = async (action: string, membreId: UserId, structureId: StructureId, authorId: UserId) => {
  if (action === "create" || action === "modify") {
    await addLog(membreId, "User", "Devient responsable de la structure : {{dynamic}}", {
      author: authorId,
      dynamicId: structureId,
      model_dynamic: "Structure",
    });
    await addLog(structureId, "Structure", "Nouveau responsable : {{dynamic}}", {
      author: authorId,
      dynamicId: membreId,
      model_dynamic: "User",
    });
  }
};
