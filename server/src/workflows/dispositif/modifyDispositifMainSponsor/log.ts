import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { addLog } from "../../../modules/logs/logs.service";
import { DispositifDoc } from "../../../schema/schemaDispositif";

export const log = async (
  oldDispositif: DispositifDoc,
  dispositifId: ObjectId,
  sponsorId: ObjectId,
  authorId: ObjectId
) => {
  try {
    //@ts-ignore
    if (oldDispositif.mainSponsor && oldDispositif.mainSponsor !== sponsorId) {
      await addLog(
        //@ts-ignore
        oldDispositif.mainSponsor,
        "Structure",
        "Fiche supprimée de cette structure et nouvelle structure attribuée : {{dynamic}}",
        {
          dynamicId: sponsorId,
          model_dynamic: "Structure",
          link: {
            id: dispositifId,
            model_link: "Dispositif",
            next: "ModalContenu"
          },
          author: authorId
        }
      );
      await addLog(
        sponsorId,
        "Structure",
        "Fiche supprimée de la structure {{dynamic}} et attribuée à cette structure",
        {
          //@ts-ignore
          dynamicId: oldDispositif.mainSponsor,
          model_dynamic: "Structure",
          link: {
            id: dispositifId,
            model_link: "Dispositif",
            next: "ModalContenu"
          },
          author: authorId
        }
      );
    }
    //@ts-ignore
    if (!oldDispositif.mainSponsor && sponsorId) {
      await addLog(
        sponsorId,
        "Structure",
        "Nouvelle fiche attribuée : {{dynamic}}",
        {
          dynamicId: dispositifId,
          model_dynamic: "Dispositif",
          link: {
            id: dispositifId,
            model_link: "Dispositif",
            next: "ModalContenu"
          },
          author: authorId
        }
      );
    }
    //@ts-ignore
    if (oldDispositif.mainSponsor && !sponsorId) {
      await addLog(
        sponsorId,
        "Structure",
        "Fiche supprimée de la structure : {{dynamic}} et non attribuée à une nouvelle structure",
        {
          //@ts-ignore
          dynamicId: oldDispositif.mainSponsor,
          model_dynamic: "Structure",
          link: {
            id: dispositifId,
            model_link: "Dispositif",
            next: "ModalContenu"
          },
          author: authorId
        }
      );
    }
    await addLog(
      dispositifId,
      "Dispositif",
      "Structure responsable modifiée : {{dynamic}}",
      {
        dynamicId: sponsorId,
        model_dynamic: "Structure",
        link: {
          id: sponsorId,
          model_link: "Structure",
          next: "ModalStructure"
        },
        author: authorId
      }
    );
  } catch (e) {
    logger.error("[modifyDispositifMainSponsor] log error", e);
  }
}
