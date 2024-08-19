import { DispositifId, ObjectId, LangueId, UserId } from "../../../typegoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (dispositifId: DispositifId, authorId: UserId, langueId: LangueId) => {
  await addLog(dispositifId, "Dispositif", "Traduction validée en : {{dynamic}}", {
    author: new ObjectId(authorId),
    dynamicId: new ObjectId(langueId),
    model_dynamic: "Langue"
  });
};
