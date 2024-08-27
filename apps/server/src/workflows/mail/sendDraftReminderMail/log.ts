import { addLog } from "~/modules/logs/logs.service";
import { DispositifId } from "~/typegoose";

export const log = async (dispositifId: DispositifId, reminder: string) => {
  await addLog(
    dispositifId,
    "Dispositif",
    reminder === "first" ? "Première relance brouillon par email" : "Deuxième relance brouillon par email (30 jours)",
  );
};
