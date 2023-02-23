import { DispositifId } from "../../../typegoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (dispositifId: DispositifId) => {
  await addLog(dispositifId, "Dispositif", "Relance pour mise à jour (90 jours)");
};
