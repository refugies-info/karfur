import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (
  dispositifId: ObjectId,
  themes: boolean,
  authorId: ObjectId,
) => {
  await addLog(
    dispositifId,
    "Dispositif",
    themes ? "Thèmes modifiés" : "Besoins modifiés",
    {
      link: {
        id: dispositifId,
        model_link: "Dispositif",
        next: "ModalNeeds"
      },
      author: authorId
    }
  );
}
