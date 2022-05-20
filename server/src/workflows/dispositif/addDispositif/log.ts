import { ObjectId } from "mongoose";
import { addLog } from "../../../modules/logs/logs.service";
import { DispositifDoc } from "../../../schema/schemaDispositif";
import { Request } from "./addDispositif";
import logger from "../../../logger";

export const log = async (
  dispositif: Request,
  originalDispositif: DispositifDoc & { mainSponsor: {_id: ObjectId} },
  authorId: ObjectId
) => {
  try {
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
    // status
    if (originalDispositif.status !== dispositif.status) {
      await addLog(
        dispositif.dispositifId,
        "Dispositif",
        "Statut modifié : " + dispositif.status,
        { author: authorId }
      );
    }

    const newTags = JSON.stringify(dispositif.tags.filter(t => !!t).map(tag => tag.short).sort());
    // @ts-ignore
    const oldTags = JSON.stringify(originalDispositif.tags.filter(t => !!t).map(tag => tag.short).sort());
    if (newTags !== oldTags) {
      await addLog(
        dispositif.dispositifId,
        "Dispositif",
        "Thèmes modifiés",
        { author: authorId }
      );
    }

    // sponsor
    const oldSponsorId = originalDispositif.mainSponsor?._id;
    //@ts-ignore
    const newSponsorId = dispositif.mainSponsor?._id || dispositif.mainSponsor;
    const oldSponsorIdString = (oldSponsorId || "").toString();
    const newSponsorIdString = (newSponsorId || "").toString();

    if (oldSponsorIdString !== newSponsorIdString) {
      if (!!oldSponsorIdString && !!newSponsorIdString) { // sponsor changes
        await addLog(
          dispositif.dispositifId,
          "Dispositif",
          "Structure responsable modifiée : {{dynamic}}",
          {
            dynamicId: newSponsorId,
            model_dynamic: "Structure",
            link: {
              id: newSponsorId,
              model_link: "Structure",
              next: "ModalStructure"
            },
            author: authorId
          }
        );
        await addLog(
          oldSponsorId,
          "Structure",
          "Fiche supprimée de cette structure et nouvelle structure attribuée : {{dynamic}}",
          {
            dynamicId: newSponsorId,
            model_dynamic: "Structure",
            link: {
              id: dispositif.dispositifId,
              model_link: "Dispositif",
              next: "ModalContenu"
            },
            author: authorId
          }
        );
        await addLog(
          newSponsorId,
          "Structure",
          "Fiche supprimée de la structure {{dynamic}} et attribuée à cette structure",
          {
            dynamicId: oldSponsorId,
            model_dynamic: "Structure",
            link: {
              id: dispositif.dispositifId,
              model_link: "Dispositif",
              next: "ModalContenu"
            },
            author: authorId
          }
        );
      }
      if (!oldSponsorIdString && newSponsorIdString) { // sponsor added
        await addLog(
          newSponsorId,
          "Structure",
          "Nouvelle fiche attribuée : {{dynamic}}",
          {
            dynamicId: dispositif.dispositifId,
            model_dynamic: "Dispositif",
            link: {
              id: dispositif.dispositifId,
              model_link: "Dispositif",
              next: "ModalContenu"
            },
            author: authorId
          }
        );
      }
      if (oldSponsorIdString && !newSponsorIdString) { // sponsor deleted
        await addLog(
          oldSponsorId,
          "Structure",
          "Fiche supprimée de la structure : {{dynamic}} et non attribuée à une nouvelle structure",
          {
            dynamicId: oldSponsorId,
            model_dynamic: "Structure",
            link: {
              id: dispositif.dispositifId,
              model_link: "Dispositif",
              next: "ModalContenu"
            },
            author: authorId
          }
        );
        await addLog(
          dispositif.dispositifId,
          "Dispositif",
          "Structure responsable supprimée : {{dynamic}}",
          {
            dynamicId: oldSponsorId,
            model_dynamic: "Structure",
            link: {
              id: oldSponsorId,
              model_link: "Structure",
              next: "ModalStructure"
            },
            author: authorId
          }
        );
      }
    }
  } catch (e) {
    logger.error("[addDispositif] error while logging", e);
  }
}
