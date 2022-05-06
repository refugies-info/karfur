import { ObjectId } from "mongoose";
import { addLog } from "modules/logs/logs.service";

export const log = async (
  dispositifId: ObjectId,
  reminder: string
) => {
  await addLog(
    dispositifId,
    "Dispositif",
    reminder === "first" ? "Première relance brouillon par email" : "Deuxième relance brouillon par email (30 jours)"
  );
}
