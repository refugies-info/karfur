import { ObjectId } from "mongoose";
import { addLog } from "modules/logs/logs.service";

export const log = async (
  action: string,
  role: string,
  membreId: ObjectId,
  structureId: ObjectId,
  authorId: ObjectId
) => {
  if (action === "create" || action === "modify") {
    const roleLog = role === "administrateur" ? "responsable" : "rédacteur";
    await addLog(
      membreId,
      "User",
      `Devient ${roleLog} de la structure : {{dynamic}}`,
      {
        author: authorId,
        dynamicId: structureId,
        model_dynamic: "Structure"
      }
    );
    await addLog(
      structureId,
      "Structure",
      `Nouveau ${roleLog} : {{dynamic}}`,
      {
        author: authorId,
        dynamicId: membreId,
        model_dynamic: "User"
      }
    );
  }

}
