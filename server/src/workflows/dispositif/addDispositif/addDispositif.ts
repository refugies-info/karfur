import { RequestFromClientWithBody, Res } from "../../../types/interface";
import logger = require("../../../logger");
import { ObjectId } from "mongoose";
import { turnHTMLtoJSON } from "../../../controllers/dispositif/functions";
import {
  getDispositifByIdWithMainSponsor,
  updateDispositifInDB,
  createDispositifInDB,
} from "../../../modules/dispositif/dispositif.repository";
import { checkUserIsAuthorizedToModifyDispositif } from "../../../libs/checkAuthorizations";
import { updateTraductions } from "../../../modules/traductions/updateTraductions";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import { updateLanguagesAvancement } from "../../../controllers/langues/langues.service";
import { updateAssociatedDispositifsInStructure } from "../../../modules/structure/structure.repository";
import { DispositifDoc } from "../../../schema/schemaDispositif";
import { getRoleByName } from "../../../controllers/role/role.repository";
import { addRoleAndContribToUser } from "../../../modules/users/users.repository";

interface Request {
  titreInformatif: string;
  dispositifId: ObjectId;
  status: string;
  contenu: any;
  nbMots: number;
}

export const addDispositif = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[addDispositif] received");

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
        logger.info("[add_dispositif] dispositif is Actif", {
          dispositifId: dispResult._id,
        });
        try {
          await addOrUpdateDispositifInContenusAirtable(
            dispResult.titreInformatif,
            dispResult.titreMarque,
            dispResult._id,
            dispResult.tags,
            null
          );
        } catch (error) {
          logger.error(
            "[add_dispositif] error while updating contenu in airtable",
            { error }
          );
        }
      }
      try {
        logger.info("[add_dispositif] updating avancement");
        await updateLanguagesAvancement();
      } catch (error) {
        logger.error("[add_dispositif] error while updating avancement", {
          error,
        });
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
    }

    //J'associe la structure principale à ce dispositif
    if (dispResult.mainSponsor) {
      try {
        await updateAssociatedDispositifsInStructure(
          dispResult._id,
          dispResult.mainSponsor
        );
      } catch (error) {
        logger.error(
          "[updateAssociatedDispositifsInStructure] error whil updating structures",
          {
            dispositifId: dispResult._id,
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
