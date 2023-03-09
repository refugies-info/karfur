import { Dispositif, DispositifId, ObjectId, StructureId } from "../../../typegoose";
import logger from "../../../logger";
import { addLog } from "../../../modules/logs/logs.service";
import { Id } from "api-types";

export const log = async (
  oldDispositif: Dispositif,
  dispositifId: DispositifId,
  sponsorId: StructureId,
  authorId: Id
) => {
  try {
    if (oldDispositif.mainSponsor && oldDispositif.mainSponsor !== sponsorId) {
      await addLog(
        oldDispositif.mainSponsor.toString(),
        "Structure",
        "Fiche supprimée de cette structure et nouvelle structure attribuée : {{dynamic}}",
        {
          dynamicId: new ObjectId(sponsorId),
          model_dynamic: "Structure",
          link: {
            id: dispositifId,
            model_link: "Dispositif",
            next: "ModalContenu"
          },
          author: new ObjectId(authorId.toString())
        }
      );
      await addLog(
        sponsorId,
        "Structure",
        "Fiche supprimée de la structure {{dynamic}} et attribuée à cette structure",
        {
          dynamicId: oldDispositif.mainSponsor.toString(),
          model_dynamic: "Structure",
          link: {
            id: dispositifId,
            model_link: "Dispositif",
            next: "ModalContenu"
          },
          author: new ObjectId(authorId.toString())
        }
      );
    }
    if (!oldDispositif.mainSponsor && sponsorId) {
      await addLog(sponsorId, "Structure", "Nouvelle fiche attribuée : {{dynamic}}", {
        dynamicId: dispositifId,
        model_dynamic: "Dispositif",
        link: {
          id: dispositifId,
          model_link: "Dispositif",
          next: "ModalContenu"
        },
        author: new ObjectId(authorId.toString())
      });
    }
    if (oldDispositif.mainSponsor && !sponsorId) {
      await addLog(
        sponsorId,
        "Structure",
        "Fiche supprimée de la structure : {{dynamic}} et non attribuée à une nouvelle structure",
        {
          dynamicId: oldDispositif.mainSponsor.toString(),
          model_dynamic: "Structure",
          link: {
            id: dispositifId,
            model_link: "Dispositif",
            next: "ModalContenu"
          },
          author: new ObjectId(authorId.toString())
        }
      );
    }
    await addLog(dispositifId, "Dispositif", "Structure responsable modifiée : {{dynamic}}", {
      dynamicId: sponsorId,
      model_dynamic: "Structure",
      link: {
        id: sponsorId,
        model_link: "Structure",
        next: "ModalStructure"
      },
      author: new ObjectId(authorId.toString())
    });
  } catch (e) {
    logger.error("[modifyDispositifMainSponsor] log error", e);
  }
};
