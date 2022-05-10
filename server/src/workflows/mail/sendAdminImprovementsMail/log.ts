import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (
  dispositifId: ObjectId,
  authorId: ObjectId,
) => {
  await addLog(
    dispositifId,
    "Dispositif",
    "Demande de changements envoyée",
    {
      link: {
        id: dispositifId,
        model_link: "Dispositif",
        next: "ModalImprovements"
      },
      author: authorId
    }
  );
}
