import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (
  dispositifId: ObjectId,
) => {
  await addLog(
    dispositifId,
    "Dispositif",
    "Relance pour mise à jour (90 jours)"
  );
}
