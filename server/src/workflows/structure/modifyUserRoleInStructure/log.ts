import { StructureId, UserId } from "../../../typegoose";
import { addLog } from "../../../modules/logs/logs.service";
import { StructureMemberRole } from "@refugies-info/api-types";

export const log = async (
  action: string,
  role: StructureMemberRole,
  membreId: UserId,
  structureId: StructureId,
  authorId: UserId
) => {
  if (action === "create" || action === "modify") {
    const roleLog = role === StructureMemberRole.ADMIN ? "responsable" : "rédacteur";
    await addLog(membreId, "User", `Devient ${roleLog} de la structure : {{dynamic}}`, {
      author: authorId,
      dynamicId: structureId,
      model_dynamic: "Structure"
    });
    await addLog(structureId, "Structure", `Nouveau ${roleLog} : {{dynamic}}`, {
      author: authorId,
      dynamicId: membreId,
      model_dynamic: "User"
    });
  }
};
