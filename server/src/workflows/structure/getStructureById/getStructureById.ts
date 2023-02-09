import { ExcludeMethods, Picture, RequestFromClient, Response } from "../../../types/interface";
import { castToBoolean } from "../../../libs/castToBoolean";
import logger from "../../../logger";
import { getStructure } from "../../../modules/structure/structure.repository";
import { getUserById } from "../../../modules/users/users.repository";
import { availableLanguagesWithFr } from "../../../libs/getFormattedLocale";
import { Structure } from "src/typegoose";
import { Membre, StructureId } from "src/typegoose/Structure";

interface Query {
  id: StructureId;
  withDisposAssocies: string;
  localeOfLocalizedDispositifsAssocies: string;
  withMembres: string;
}

type StructureById = ExcludeMethods<Structure> & {
  membres?: Array<Membre & { username: string; picture: Picture; last_connected: Date }>;
};

const addMembresIfNeeded = async (withMembresBoolean: boolean, structure: Structure) => {
  if (withMembresBoolean) {
    const structureMembres = structure.membres || [];
    const neededFields = { username: 1, picture: 1, last_connected: 1 };

    const membres = await Promise.all(
      structureMembres.map((membre) =>
        getUserById(membre.userId.toString(), neededFields).then((user) => ({
          username: user.username,
          picture: user.picture,
          last_connected: user.last_connected,
          roles: membre.roles,
          added_at: membre.added_at,
          userId: membre.userId.toString()
        }))
      )
    );

    return { ...structure, membres };
  }
  const newStructure = { ...structure };
  delete newStructure.membres;
  return newStructure;
};

export const getStructureById = async (req: RequestFromClient<Query>, res: Response<StructureById>) => {
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

    const fields = {};
    const structure = await getStructure(id, populateDisposAssocies, fields);
    if (!structure) {
      throw new Error("No structure");
    }

    const isAdmin = !!(req.user ? req.user.isAdmin() : false);
    const isMember = !!(req.userId
      ? (structure.membres || []).find((m) => {
          if (!m.userId) return false;
          return m.userId.toString() === req.userId.toString();
        })
      : false);
    const shouldIncludeMembers = (isAdmin || isMember) && withMembresBoolean;

    const structureWithMembres = await addMembresIfNeeded(shouldIncludeMembers, structure);

    return res.status(200).json({
      text: "Succès",
      // @ts-ignore
      data: structureWithMembres
    });
  } catch (error) {
    logger.error("[getStructureById] error while getting structure with id", {
      error
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
