import { RequestFromClientWithBody, Res } from "../../../types/interface";
import logger = require("../../../logger");
import { ObjectId } from "mongoose";
import { turnHTMLtoJSON } from "../../../controllers/dispositif/functions";
import {
  getDispositifByIdWithMainSponsor,
  updateDispositifInDB,
  createDispositifInDB,
} from "../../../modules/dispositif/dispositif.repository";
import {
  checkUserIsAuthorizedToModifyDispositif,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { updateTraductions } from "../../../modules/traductions/updateTraductions";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import { updateLanguagesAvancement } from "../../../modules/langues/langues.service";
import { updateAssociatedDispositifsInStructure } from "../../../modules/structure/structure.repository";
import { DispositifDoc } from "../../../schema/schemaDispositif";
import { getRoleByName } from "../../../controllers/role/role.repository";
import { addRoleAndContribToUser } from "../../../modules/users/users.repository";
import { sendMailToStructureMembersWhenDispositifEnAttente } from "../../../modules/mail/sendMailToStructureMembersWhenDispositifEnAttente";

interface Request {
  titreInformatif: string;
  dispositifId: ObjectId;
  status: string;
  contenu: any;
  nbMots: number;
  typeContenu: "dispositif" | "demarche";
  mainSponsor: ObjectId;
  titreMarque: string;
}

/**
 * update or create a dispositif
 * if update : updateTraductions, updateDispositif, updateContentInAirtable and updateLanguageAvancement
 * if create : create dispo in db and add role and contrib to creato
 * for both : update dispositif associes in structure
 */

export const addDispositif = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[addDispositif] received");
    checkRequestIsFromSite(req.fromSite);

    if (!req.body || (!req.body.titreInformatif && !req.body.dispositifId)) {
      throw new Error("INVALID_REQUEST");
    }

    let dispositif = req.body;

    logger.info("[addDispositif] received a dispositif", {
      dispositifId: dispositif.dispositifId,
    });

    dispositif.status = dispositif.status || "En attente";
    let dispResult: DispositifDoc;

    if (dispositif.contenu) {
      // transform dispositif.contenu in json
      dispositif.nbMots = turnHTMLtoJSON(dispositif.contenu);
    }

    if (dispositif.dispositifId) {
      const originalDispositif = await getDispositifByIdWithMainSponsor(
        dispositif.dispositifId,
        "all"
      );
      checkUserIsAuthorizedToModifyDispositif(
        originalDispositif,
        req.userId,
        // @ts-ignore : populate roles
        req.user.roles
      );

      logger.info("[addDispositif] updating a dispositif", {
        dispositifId: dispositif.dispositifId,
      });

      if (dispositif.contenu) {
        // @ts-ignore
        await updateTraductions(originalDispositif, dispositif, req.userId);

        // @ts-ignore
        dispositif.avancement =
          // @ts-ignore
          originalDispositif.avancement.fr || originalDispositif.avancement;

        // @ts-ignore
        dispositif.publishedAt = Date.now();
      }

      if (dispositif.status === "Actif") {
        // @ts-ignore
        dispositif.publishedAt = Date.now();
      }
      //now I need to save the dispositif and the translation
      dispResult = await updateDispositifInDB(
        dispositif.dispositifId,
        dispositif
      );

      // when publish or modify a dispositif, update table in airtable to follow the traduction
      if (
        dispResult.status === "Actif" &&
        dispResult.typeContenu === "dispositif"
      ) {
        logger.info("[addDispositif] dispositif is Actif", {
          dispositifId: dispResult._id,
        });
        try {
          await addOrUpdateDispositifInContenusAirtable(
            dispResult.titreInformatif,
            dispResult.titreMarque,
            dispResult._id,
            dispResult.tags,
            null,
            false
          );
        } catch (error) {
          logger.error(
            "[addDispositif] error while updating contenu in airtable",
            { error: error.message }
          );
        }
      }
      try {
        logger.info("[addDispositif] updating avancement");
        await updateLanguagesAvancement();
      } catch (error) {
        logger.error("[addDispositif] error while updating avancement", {
          error: error.message,
        });
      }

      if (
        dispositif.typeContenu === "dispositif" &&
        originalDispositif.status !== "En attente" &&
        dispositif.status === "En attente" &&
        dispositif.mainSponsor
      ) {
        try {
          logger.info(
            "[addDispositif] send mail to structure member when new dispositif en attente"
          );

          await sendMailToStructureMembersWhenDispositifEnAttente(
            dispositif.mainSponsor,
            dispositif.dispositifId,
            dispositif.titreInformatif,
            dispositif.titreMarque,
            dispositif.typeContenu
          );
        } catch (error) {
          logger.error(
            "[addDispositif] error while sending mail to structure when new fiche en attente",
            { error: error.message }
          );
        }
      }
    } else {
      logger.info("[addDispositif] creating a new dispositif", {
        title: dispositif.titreInformatif,
      });
      // @ts-ignore
      dispositif.creatorId = req.userId;
      // @ts-ignore
      dispResult = await createDispositifInDB(dispositif);

      const contribRole = await getRoleByName("Contrib");
      await addRoleAndContribToUser(
        req.userId,
        contribRole._id,
        dispResult._id
      );
      if (
        dispositif.typeContenu === "dispositif" &&
        dispositif.status === "En attente" &&
        dispositif.mainSponsor
      ) {
        try {
          logger.info(
            "[addDispositif] send mail to structure member when new dispositif en attente"
          );

          await sendMailToStructureMembersWhenDispositifEnAttente(
            dispositif.mainSponsor,
            dispResult._id,
            dispositif.titreInformatif,
            dispositif.titreMarque,
            dispositif.typeContenu
          );
          // send mail FicheEnAttenteTo
        } catch (error) {
          logger.error(
            "[addDispositif] error while sending mail to structure when new fiche en attente",
            { error: error.message }
          );
        }
      }
    }

    //J'associe la structure principale à ce dispositif
    // @ts-ignore
    if (dispResult.mainSponsor) {
      try {
        await updateAssociatedDispositifsInStructure(
          dispResult._id,
          // @ts-ignore
          dispResult.mainSponsor
        );
      } catch (error) {
        logger.error(
          "[updateAssociatedDispositifsInStructure] error whil updating structures",
          {
            dispositifId: dispResult._id,
            // @ts-ignore
            sponsorId: dispResult.mainSponsor,
          }
        );
      }
    }

    return res.status(200).json({
      text: "Succès",
      data: dispResult,
    });
  } catch (error) {
    logger.error("[addDispositif] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
