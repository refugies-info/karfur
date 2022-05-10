import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";
import { DispositifDoc } from "../../../schema/schemaDispositif";

export const log = async (
  dispositif: DispositifDoc,
  dispositifId: ObjectId,
) => {
  await addLog(
    dispositifId,
    "Dispositif",
    "Nouvelle réaction sur la fiche",
    {
      link: {
        id: dispositifId,
        model_link: "Dispositif",
        next: "ModalReaction"
      }
    }
  );
  await addLog(
    //@ts-ignore
    dispositif.mainSponsor,
    "Structure",
    "Nouvelle réaction sur la fiche : {{dynamic}}",
    {
      dynamicId: dispositifId,
      model_dynamic: "Dispositif",
      link: {
        id: dispositifId,
        model_link: "Dispositif",
        next: "ModalReaction"
      }
    }
  );
}
