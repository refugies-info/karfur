import { DispositifId, LangueId, UserId } from "src/typegoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (dispositifId: DispositifId, authorId: UserId, langueId: LangueId) => {
  await addLog(dispositifId, "Dispositif", "Traduction validée en : {{dynamic}}", {
    author: authorId,
    dynamicId: langueId,
    model_dynamic: "Langue"
  });
};
