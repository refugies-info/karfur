import { type DispositifId, type LangueId, ObjectId, type UserId } from "@refugies-info/mongo";
import { addLog } from "~/modules/logs/logs.service";

export const log = async (dispositifId: DispositifId, authorId: UserId, langueId: LangueId) => {
  await addLog(dispositifId, "Dispositif", "Traduction validée en : {{dynamic}}", {
    author: new ObjectId(authorId.toString()),

    dynamicId: new ObjectId(langueId.toString()),
    model_dynamic: "Langue",
  });
};
