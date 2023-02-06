import { Dispositif, DispositifId } from "src/typegoose";
import { addLog } from "../../../modules/logs/logs.service";

export const log = async (dispositif: Dispositif, dispositifId: DispositifId) => {
  await addLog(dispositifId, "Dispositif", "Nouvelle réaction sur la fiche", {
    link: {
      id: dispositifId,
      model_link: "Dispositif",
      next: "ModalReaction"
    }
  });
  await addLog(dispositif.mainSponsor.toString(), "Structure", "Nouvelle réaction sur la fiche : {{dynamic}}", {
    dynamicId: dispositifId,
    model_dynamic: "Dispositif",
    link: {
      id: dispositifId,
      model_link: "Dispositif",
      next: "ModalReaction"
    }
  });
};
