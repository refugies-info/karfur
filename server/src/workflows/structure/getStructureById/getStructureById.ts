import { RequestFromClient, Res } from "../../../types/interface";
import { castToBoolean } from "../../../libs/castToBoolean";
import logger from "../../../logger";
import { getStructureFromDB } from "../../../modules/structure/structure.repository";
import { turnToLocalized } from "../../../controllers/dispositif/functions";
import { asyncForEach } from "../../../libs/asyncForEach";
import { getUserById } from "../../../modules/users/users.repository";
import { availableLanguagesWithFr } from "../../../libs/getFormattedLocale";
import { Dispositif, Structure } from "src/typegoose";
import { Membre } from "src/typegoose/Structure";

interface Query {
  id: string;
  withDisposAssocies: string;
  localeOfLocalizedDispositifsAssocies: string;
  withMembres: string;
}

const adaptDispositifsAssocies = (dispositifs: Dispositif[]) =>
  dispositifs.map((dispositif) => ({
    titreInformatif: dispositif.translations.fr.content.titreInformatif,
    titreMarque: dispositif.translations.fr.content.titreMarque,
    _id: dispositif._id,
    theme: dispositif.theme,
    secondaryThemes: dispositif.secondaryThemes,
    abstract: dispositif.translations.fr.content.abstract,
    status: dispositif.status,
    suggestions: dispositif.suggestions,
    contenu: dispositif.translations.fr,
    mainSponsor: dispositif.mainSponsor,
    typeContenu: dispositif.type,
    created_at: dispositif.created_at,
    nbVues: dispositif.nbVues || 0,
    nbMercis: dispositif.merci ? dispositif.merci.length : 0
  }));

const addDisposAssociesIfNeeded = (
  withLocalizedDispositifsBoolean: boolean,
  structure: Structure,
  localeOfLocalizedDispositifsAssocies: string
) => {
  if (withLocalizedDispositifsBoolean) {
    const dispositifsAssocies = structure.getDispositifsAssocies();
    const array: string[] = [];

    array.forEach.call(dispositifsAssocies, (dispositif: any) => {
      turnToLocalized(dispositif, localeOfLocalizedDispositifsAssocies);
    });
    const simplifiedDispositifsAssocies = adaptDispositifsAssocies(dispositifsAssocies);
    return {
      ...structure,
      dispositifsAssocies: simplifiedDispositifsAssocies
    };
  }
  return structure;
};

const addMembresIfNeeded = async (withMembresBoolean: boolean, structure: Structure) => {
  if (withMembresBoolean) {
    const structureMembres = structure.membres || [];
    let membresArray: Membre[] = [];
    await asyncForEach(structureMembres, async (membre) => {
      try {
        if (!membre.userId) return;
        const neededFields = { username: 1, picture: 1, last_connected: 1 };
        const populateMembre = await getUserById(membre.userId.toString(), neededFields);
        membresArray.push({
          ...populateMembre.toJSON({ flattenMaps: false }),
          roles: membre.roles,
          added_at: membre.added_at,
          userId: membre.userId
        });
      } catch (error) {
        logger.error("[getStructureById] error while getting user", {
          userId: membre.userId,
          error: error.message
        });
      }
    });

    return { ...structure, membres: membresArray };
  }
  const newStructure = { ...structure };
  delete newStructure.membres;
  return newStructure;
};

export const getStructureById = async (req: RequestFromClient<Query>, res: Res) => {
  if (!req.query || !req.query.id) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  try {
    const { id, withDisposAssocies, localeOfLocalizedDispositifsAssocies, withMembres } = req.query;
    const withDisposAssociesBoolean = castToBoolean(withDisposAssocies);
    const withMembresBoolean = castToBoolean(withMembres);

    const withLocalizedDispositifsBoolean = availableLanguagesWithFr.includes(localeOfLocalizedDispositifsAssocies);

    logger.info("[getStructureById] get structure with id", {
      id,
      withDisposAssociesBoolean,
      withLocalizedDispositifsBoolean,
      localeOfLocalizedDispositifsAssocies,
      withMembresBoolean
    });

    const populateDisposAssocies = withLocalizedDispositifsBoolean ? true : withDisposAssociesBoolean ? true : false;

    const fields = "all";
    const structure = await getStructureFromDB(id, populateDisposAssocies, fields);
    if (!structure) {
      throw new Error("No structure");
    }

    const structureWithDisposAssocies = addDisposAssociesIfNeeded(
      withLocalizedDispositifsBoolean,
      structure,
      localeOfLocalizedDispositifsAssocies
    );

    const isAdmin = !!(req.user ? req.user.hasRole("Admin") : false);
    const isMember = !!(req.userId
      ? (structureWithDisposAssocies.membres || []).find((m) => {
          if (!m.userId) return false;
          return m.userId.toString() === req.userId.toString();
        })
      : false);
    const shouldIncludeMembers = (isAdmin || isMember) && withMembresBoolean;

    const structureWithMembres = await addMembresIfNeeded(
      shouldIncludeMembers,
      // @ts-ignore FIXME
      structureWithDisposAssocies
    );

    return res.status(200).json({
      text: "Succès",
      data: structureWithMembres
    });
  } catch (error) {
    logger.error("[getStructureById] error while getting structure with id", {
      error: error.message
    });
    if (error.message === "No structure") {
      res.status(404).json({
        text: "Pas de résultat"
      });
      return;
    }
    return res.status(500).json({
      text: "Erreur interne"
    });
  }
};
