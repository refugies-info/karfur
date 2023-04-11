import { addLog } from "../../../modules/logs/logs.service";
import logger from "../../../logger";
import { Dispositif, UserId } from "../../../typegoose";

export const log = async (dispositif: Dispositif, originalDispositif: Dispositif, authorId: UserId) => {
  try {
    await addLog(dispositif._id, "Dispositif", "Contenu modifié", { author: authorId });
    await addLog(authorId, "User", "Modification de la fiche : {{dynamic}}", {
      dynamicId: dispositif._id,
      model_dynamic: "Dispositif",
      link: {
        id: dispositif._id,
        model_link: "Dispositif",
        next: "ModalContenu"
      }
    });
    // status
    if (originalDispositif.status !== dispositif.status) {
      await addLog(dispositif._id, "Dispositif", "Statut modifié : " + dispositif.status, {
        author: authorId
      });
    }

    const newThemes = JSON.stringify([dispositif.theme, ...dispositif.secondaryThemes.sort()].filter((t) => !!t));
    const oldThemes = JSON.stringify(
      [originalDispositif.theme, ...originalDispositif.secondaryThemes.sort()].filter((t) => !!t)
    );
    if (newThemes !== oldThemes) {
      await addLog(dispositif._id, "Dispositif", "Thèmes modifiés", { author: authorId });
    }

    // sponsor
    const oldSponsorId = originalDispositif.mainSponsor;
    const newSponsorId = dispositif.mainSponsor || dispositif.mainSponsor;
    const oldSponsorIdString = (oldSponsorId || "").toString();
    const newSponsorIdString = (newSponsorId || "").toString();

    if (oldSponsorIdString !== newSponsorIdString) {
      if (!!oldSponsorIdString && !!newSponsorIdString) {
        // sponsor changes
        await addLog(dispositif._id, "Dispositif", "Structure responsable modifiée : {{dynamic}}", {
          dynamicId: newSponsorId.toString(),
          model_dynamic: "Structure",
          link: {
            id: newSponsorId.toString(),
            model_link: "Structure",
            next: "ModalStructure"
          },
          author: authorId
        });
        await addLog(
          oldSponsorId.toString(),
          "Structure",
          "Fiche supprimée de cette structure et nouvelle structure attribuée : {{dynamic}}",
          {
            dynamicId: newSponsorId.toString(),
            model_dynamic: "Structure",
            link: {
              id: dispositif._id,
              model_link: "Dispositif",
              next: "ModalContenu"
            },
            author: authorId
          }
        );
        await addLog(
          newSponsorId.toString(),
          "Structure",
          "Fiche supprimée de la structure {{dynamic}} et attribuée à cette structure",
          {
            dynamicId: oldSponsorId.toString(),
            model_dynamic: "Structure",
            link: {
              id: dispositif._id,
              model_link: "Dispositif",
              next: "ModalContenu"
            },
            author: authorId
          }
        );
      }
      if (!oldSponsorIdString && newSponsorIdString) {
        // sponsor added
        await addLog(newSponsorId.toString(), "Structure", "Nouvelle fiche attribuée : {{dynamic}}", {
          dynamicId: dispositif._id,
          model_dynamic: "Dispositif",
          link: {
            id: dispositif._id,
            model_link: "Dispositif",
            next: "ModalContenu"
          },
          author: authorId
        });
      }
      if (oldSponsorIdString && !newSponsorIdString) {
        // sponsor deleted
        await addLog(
          oldSponsorId.toString(),
          "Structure",
          "Fiche supprimée de la structure : {{dynamic}} et non attribuée à une nouvelle structure",
          {
            dynamicId: oldSponsorId.toString(),
            model_dynamic: "Structure",
            link: {
              id: dispositif._id,
              model_link: "Dispositif",
              next: "ModalContenu"
            },
            author: authorId
          }
        );
        await addLog(dispositif._id, "Dispositif", "Structure responsable supprimée : {{dynamic}}", {
          dynamicId: oldSponsorId.toString(),
          model_dynamic: "Structure",
          link: {
            id: oldSponsorId.toString(),
            model_link: "Structure",
            next: "ModalStructure"
          },
          author: authorId
        });
      }
    }
  } catch (e) {
    logger.error("[addDispositif] error while logging", e);
  }
};
