import { ObjectId } from "mongoose";
import { addLog } from "modules/logs/logs.service";
import { DispositifDoc } from "schema/schemaDispositif";
import { Request } from "./addDispositif";

export const log = async (dispositif: Request, originalDispositif: DispositifDoc, authorId: ObjectId) => {
  await addLog(
    dispositif.dispositifId,
    "Dispositif",
    "Contenu modifié",
    { author: authorId }
  );
  await addLog(
    authorId,
    "User",
    "Modification de la fiche : {{dynamic}}",
    {
      dynamicId: dispositif.dispositifId,
      model_dynamic: "Dispositif",
      link: {
        id: dispositif.dispositifId,
        model_link: "Dispositif",
        next: "ModalContenu"
      }
    }
  );
  if (originalDispositif.status !== dispositif.status) {
    await addLog(
      dispositif.dispositifId,
      "Dispositif",
      "Statut modifié : " + dispositif.status,
      { author: authorId }
    );
  }
}
