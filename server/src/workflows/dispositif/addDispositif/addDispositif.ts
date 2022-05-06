import logger = require("logger");
import { ObjectId } from "mongoose";
import { RequestFromClientWithBody, Res } from "types/interface";
import { turnHTMLtoJSON } from "controllers/dispositif/functions";
import { getRoleByName } from "controllers/role/role.repository";
import {
  getDispositifByIdWithMainSponsor,
  updateDispositifInDB,
  createDispositifInDB,
} from "modules/dispositif/dispositif.repository";
import { updateTraductions } from "modules/traductions/updateTraductions";
import { addOrUpdateDispositifInContenusAirtable } from "controllers/miscellaneous/airtable";
import { updateLanguagesAvancement } from "modules/langues/langues.service";
import { getStructureFromDB, updateAssociatedDispositifsInStructure } from "modules/structure/structure.repository";
import { sendMailToStructureMembersWhenDispositifEnAttente } from "modules/mail/sendMailToStructureMembersWhenDispositifEnAttente";
import { computePossibleNeeds } from "modules/needs/needs.service";
import { addRoleAndContribToUser } from "modules/users/users.repository";
import {
  checkUserIsAuthorizedToModifyDispositif,
  checkRequestIsFromSite,
} from "libs/checkAuthorizations";
import { DispositifDoc } from "schema/schemaDispositif";
import { UserDoc } from "schema/schemaUser";
import { StructureDoc } from "schema/schemaStructure";
import { log } from "./log";

export interface Request {
  titreInformatif: string;
  dispositifId: ObjectId;
  status: string;
  contenu: any;
  nbMots: number;
  typeContenu: "dispositif" | "demarche";
  mainSponsor: ObjectId;
  titreMarque: string;
  tags?: any[];
  needs?: ObjectId[];
  saveType: "auto" | "validate"| "save"
}

export const getNewStatus = (
  dispositif: Request | null,
  structure: StructureDoc | null,
  user: UserDoc | null,
  saveType: "auto" | "validate"| "save"
) => {
  // keep draft if already draft
  if (dispositif.status === "Brouillon" && saveType !== "validate") {
    return "Brouillon"

  // validate rejected dispositif
  } else if (
    dispositif?.status === "Rejeté structure" && // = Rejeté
    saveType === "validate"
  ) {
    return "En attente";

  // keep current status
  } else if (
    dispositif?.status &&
    ![
      "",
      "En attente non prioritaire", // = Sans structure
      "Brouillon",
      "Accepté structure", // = Accepté
    ].includes(dispositif.status)
  ) {
    return dispositif.status;

  // is admin or contrib of current structure, or admin
  } else if (structure && user) {
    const isAdmin = user.roles.find((x: any) => x.nom === "Admin");
    const membre = (structure?.membres || []).find(
      (x: any) => x.userId.toString() === user._id.toString()
    );
    const isMembreOfStructure = (membre?.roles || []).some((x) => x === "administrateur" || x === "contributeur")
    if (saveType === "validate") {
      if ((isMembreOfStructure || isAdmin)) {
        return "En attente admin"; // = A valider
      }
      return "En attente";
    }
    return dispositif.status;
  }
  return "En attente non prioritaire"; // = Sans structure
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
    let structure: StructureDoc | null = null;
    if (dispositif.mainSponsor) {
      structure = await getStructureFromDB(
        //@ts-ignore
        dispositif.mainSponsor?._id || dispositif.mainSponsor,
        false,
        { membres: 1 }
      );
    }
    dispositif.status = getNewStatus( // set new status
      dispositif,
      structure,
      req.user,
      dispositif.saveType
    );

    delete dispositif.saveType;

    logger.info("[addDispositif] received a dispositif", {
      dispositifId: dispositif.dispositifId,
    });

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

      // Prevent auto validation
      if (dispositif.status === "Actif" && originalDispositif.status !== "Actif") {
        throw new Error("NOT_AUTHORIZED")
      }

      logger.info("[addDispositif] updating a dispositif", {
        dispositifId: dispositif.dispositifId,
      });

      if (originalDispositif.needs) {
        // if a need of the content has a tag that is not a tag of the content we remove the need
        const newNeeds = await computePossibleNeeds(
          originalDispositif.needs,
          dispositif.tags
        );
        dispositif.needs = newNeeds;
      }

      if (dispositif.contenu) {
        // @ts-ignore
        await updateTraductions(originalDispositif, dispositif, req.userId);

        // @ts-ignore
        dispositif.avancement =
          // @ts-ignore
          originalDispositif.avancement.fr || originalDispositif.avancement;
      }

      if (dispositif.status === "Actif" && originalDispositif.status !== "Actif") {
        // @ts-ignore
        dispositif.publishedAt = Date.now();
      }
      //now I need to save the dispositif and the translation
      dispResult = await updateDispositifInDB(
        dispositif.dispositifId,
        dispositif
      );

      await log(dispositif, originalDispositif, req.user._id);

      // when publish or modify a dispositif, update table in airtable to follow the traduction
      if (dispResult.status === "Actif") {
        logger.info("[addDispositif] dispositif is Actif", {
          dispositifId: dispResult._id,
        });
        try {
          await addOrUpdateDispositifInContenusAirtable(
            dispResult.titreInformatif,
            dispResult.titreMarque,
            dispResult._id,
            dispResult.tags,
            dispResult.typeContenu,
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
      if (dispositif.status === "Actif") {
        throw new Error("NOT_AUTHORIZED");
      }
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
      case "NOT_AUTHORIZED":
        return res.status(403).json({ text: "Modification interdite" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
