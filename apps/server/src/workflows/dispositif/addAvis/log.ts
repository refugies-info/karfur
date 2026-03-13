import type { Dispositif, DispositifId } from "@refugies-info/mongo";
import { addLog } from "~/modules/logs/logs.service";

export const log = async (dispositif: Dispositif, dispositifId: DispositifId) => {
  await addLog(dispositifId, "Dispositif", "Nouvel avis sur la fiche", {
    link: {
      id: dispositifId,
      model_link: "Dispositif",
      next: "ModalReaction",
    },
  });
  if (dispositif.mainSponsor) {
    await addLog(
      dispositif.mainSponsor.toString(),
      "Structure",
      "Nouvel avis sur la fiche : {{dynamic}}",
      {
        dynamicId: dispositifId,
        model_dynamic: "Dispositif",
        link: {
          id: dispositifId,
          model_link: "Dispositif",
          next: "ModalReaction",
        },
      },
    );
  }
};
