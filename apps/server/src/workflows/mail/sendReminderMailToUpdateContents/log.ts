import { addLog } from "~/modules/logs/logs.service";
import type { DispositifId } from "~/typegoose";

export const log = async (dispositifId: DispositifId) => {
  await addLog(dispositifId, "Dispositif", "Relance pour mise à jour (90 jours)");
};
