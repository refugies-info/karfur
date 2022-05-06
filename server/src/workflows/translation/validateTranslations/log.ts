import { ObjectId } from "mongoose";
import { addLog } from "modules/logs/logs.service";

export const log = async (
  dispositifId: ObjectId,
  authorId: ObjectId,
  langueId: ObjectId,
) => {
  await addLog(
    dispositifId,
    "Dispositif",
    "Traduction validé en : ",
    {
      author: authorId,
      dynamicId: langueId,
      model_dynamic: "Langue"
    }
  );
}
