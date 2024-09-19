import { addLog } from "~/modules/logs/logs.service";
import { DispositifId, LangueId, ObjectId, UserId } from "~/typegoose";

export const log = async (dispositifId: DispositifId, authorId: UserId, langueId: LangueId) => {
  await addLog(dispositifId, "Dispositif", "Traduction validée en : {{dynamic}}", {
    author: new ObjectId(authorId),
    dynamicId: new ObjectId(langueId),
    model_dynamic: "Langue",
  });
};
