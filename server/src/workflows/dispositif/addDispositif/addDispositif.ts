import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
// import { turnHTMLtoJSON } from "../../../controllers/dispositif/functions";
import { getRoleByName } from "../../../controllers/role/role.repository";
import {
  getDispositifByIdWithMainSponsor,
  updateDispositifInDB,
  createDispositifInDB
} from "../../../modules/dispositif/dispositif.repository";
// import { updateTraductions } from "../../../modules/traductions/updateTraductions";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import { updateLanguagesAvancement } from "../../../modules/langues/langues.service";
import {
  getStructureFromDB,
  updateAssociatedDispositifsInStructure
} from "../../../modules/structure/structure.repository";
import { sendMailToStructureMembersWhenDispositifEnAttente } from "../../../modules/mail/sendMailToStructureMembersWhenDispositifEnAttente";
// import { computePossibleNeeds } from "../../../modules/needs/needs.service";
import { addRoleAndContribToUser } from "../../../modules/users/users.repository";
import { checkUserIsAuthorizedToModifyDispositif, checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { log } from "./log";
import { Dispositif, Structure, Theme, User } from "src/typegoose";
import { isDocument } from "@typegoose/typegoose";

export interface Request {
  titreInformatif: string;
  dispositifId: string;
  status: string;
  contenu: any;
  nbMots: number;
  typeContenu: "dispositif" | "demarche";
  mainSponsor: Dispositif["mainSponsor"];
  titreMarque: string;
  theme?: Theme;
  secondaryThemes?: Theme[];
  needs?: string[];
  saveType: "auto" | "validate" | "save";
}

export const getNewStatus = (
  dispositif: Request | null,
  structure: Structure | null,
  user: User | null,
  saveType: "auto" | "validate" | "save"
): Dispositif["status"] => {
  // keep draft if already draft
  if (dispositif.status === "Brouillon" && saveType !== "validate") {
    return "Brouillon";

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
      "Accepté structure" // = Accepté
    ].includes(dispositif.status)
  ) {
    return dispositif.status as Dispositif["status"];

    // is admin or contrib of current structure, or admin
  } else if (structure && user) {
    const isAdmin = user.roles.find((x: any) => x.nom === "Admin");
    const membre = (structure?.membres || []).find((x: any) => x.userId.toString() === user._id.toString());
    const isMembreOfStructure = (membre?.roles || []).some((x) => x === "administrateur" || x === "contributeur");
    if (saveType === "validate") {
      if (isMembreOfStructure || isAdmin) {
        return "En attente admin"; // = A valider
      }
      return "En attente";
    }
    return dispositif.status as Dispositif["status"];
  }
  return "En attente non prioritaire"; // = Sans structure
};

/**
 * update or create a dispositif
 * if update : updateTraductions, updateDispositif, updateContentInAirtable and updateLanguageAvancement
 * if create : create dispo in db and add role and contrib to creato
 * for both : update dispositif associes in structure
 */

export const addDispositif = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[addDispositif] received");
    checkRequestIsFromSite(req.fromSite);

    if (!req.body || (!req.body.titreInformatif && !req.body.dispositifId)) {
      throw new Error("INVALID_REQUEST");
    }

    // @ts-ignore FIXME
    const dispositif: Dispositif = { ...req.body };
    let structure: Structure | null = null;
    if (dispositif.mainSponsor) {
      structure = await getStructureFromDB(
        isDocument(dispositif.mainSponsor) ? dispositif.mainSponsor?._id : dispositif.mainSponsor,
        false,
        { membres: 1 }
      );
    }
    dispositif.status = getNewStatus(
      // set new status
      req.body,
      structure,
      req.user,
      req.body.saveType
    );

    logger.info("[addDispositif] received a dispositif", {
      dispositifId: req.body.dispositifId
    });

    let dispResult: Dispositif;

    // if (dispositif.contenu) {
    //   // transform dispositif.contenu in json
    //   dispositif.nbMots = turnHTMLtoJSON(dispositif.contenu);
    // }

    if (req.body.dispositifId) {
      const originalDispositif = await getDispositifByIdWithMainSponsor(req.body.dispositifId, "all");
      checkUserIsAuthorizedToModifyDispositif(originalDispositif, req.user);

      // Prevent auto validation
      if (dispositif.status === "Actif" && originalDispositif.status !== "Actif") {
        throw new Error("NOT_AUTHORIZED");
      }

      logger.info("[addDispositif] updating a dispositif", {
        dispositifId: req.body.dispositifId
      });

      // if (originalDispositif.needs) {
      //   // if a need of the content has a theme that is not a theme of the content we remove the need
      //   const newNeeds = await computePossibleNeeds(originalDispositif.needs, [
      //     dispositif.theme._id,
      //     ...dispositif.secondaryThemes.map((t) => t._id)
      //   ]);
      //   dispositif.needs = newNeeds;
      // }

      // if (dispositif.contenu) {
      // await updateTraductions(originalDispositif, dispositif, req.userId);
      // }

      if (dispositif.status === "Actif" && originalDispositif.status !== "Actif") {
        dispositif.publishedAt = new Date();
        dispositif.publishedAtAuthor = req.userId;
      }
      dispositif.lastModificationAuthor = req.userId;

      // format themes to keep ids only
      // TODO const themesList = [dispositif.theme, ...dispositif.secondaryThemes].map((t) => t.short.fr);

      // dispositif.secondaryThemes = dispositif.secondaryThemes.map((t) => t._id);

      const isAdmin = req.user.roles.find((x: any) => x.nom === "Admin");
      if (isAdmin) {
        dispositif.themesSelectedByAuthor = false;
      }

      //now I need to save the dispositif and the translation
      dispResult = await updateDispositifInDB(req.body.dispositifId, dispositif);

      //@ts-ignore FIXME
      await log(dispositif, originalDispositif, req.user._id);

      // when publish or modify a dispositif, update table in airtable to follow the traduction
      if (dispResult.status === "Actif") {
        logger.info("[addDispositif] dispositif is Actif", {
          dispositifId: dispResult._id
        });
        try {
          await addOrUpdateDispositifInContenusAirtable(
            dispResult.translations.fr.content.titreInformatif,
            dispResult.translations.fr.content.titreMarque,
            dispResult._id,
            [], //themesList,
            dispResult.type,
            null,
            dispResult.getDepartements(),
            false
          );
        } catch (error) {
          logger.error("[addDispositif] error while updating contenu in airtable", { error: error.message });
        }
      }
      try {
        logger.info("[addDispositif] updating avancement");
        await updateLanguagesAvancement();
      } catch (error) {
        logger.error("[addDispositif] error while updating avancement", {
          error: error.message
        });
      }

      if (
        dispositif.type === "dispositif" &&
        originalDispositif.status !== "En attente" &&
        dispositif.status === "En attente" &&
        dispositif.mainSponsor
      ) {
        try {
          logger.info("[addDispositif] send mail to structure member when new dispositif en attente");

          await sendMailToStructureMembersWhenDispositifEnAttente(dispositif);
        } catch (error) {
          logger.error("[addDispositif] error while sending mail to structure when new fiche en attente", {
            error: error.message
          });
        }
      }
    } else {
      logger.info("[addDispositif] creating a new dispositif", {
        title: dispositif.translations.fr.content.titreInformatif
      });
      if (dispositif.status === "Actif") {
        throw new Error("NOT_AUTHORIZED");
      }

      dispositif.creatorId = req.userId;

      dispositif.lastModificationAuthor = req.userId;

      // dispositif.theme = dispositif.theme?._id;

      // dispositif.secondaryThemes = (dispositif.secondaryThemes || []).map((t) => t._id);

      dispositif.themesSelectedByAuthor = true;

      // @ts-ignore
      dispResult = await createDispositifInDB({ ...dispositif, nbVues: 0, nbVuesMobile: 0 });

      const contribRole = await getRoleByName("Contrib");
      await addRoleAndContribToUser(req.userId, contribRole._id, dispResult._id);
      if (dispositif.type === "dispositif" && dispositif.status === "En attente" && dispositif.mainSponsor) {
        try {
          logger.info("[addDispositif] send mail to structure member when new dispositif en attente");

          await sendMailToStructureMembersWhenDispositifEnAttente(dispositif);
          // send mail FicheEnAttenteTo
        } catch (error) {
          logger.error("[addDispositif] error while sending mail to structure when new fiche en attente", {
            error: error.message
          });
        }
      }
    }

    //J'associe la structure principale à ce dispositif
    if (dispResult.mainSponsor) {
      try {
        await updateAssociatedDispositifsInStructure(dispResult._id, dispResult.mainSponsor.toString());
      } catch (error) {
        logger.error("[updateAssociatedDispositifsInStructure] error whil updating structures", {
          dispositifId: dispResult._id,
          sponsorId: dispResult.mainSponsor
        });
      }
    }

    return res.status(200).json({
      text: "Succès",
      data: dispResult
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
