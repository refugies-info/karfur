import {
  RequestFromClient,
  Res,
  IDispositif,
  Picture,
} from "../../../types/interface";
import { ObjectId } from "mongoose";
import { castToBoolean } from "../../../libs/castToBoolean";
import logger from "../../../logger";
import { getStructureFromDB } from "../../../modules/structure/structure.repository";
import { turnToLocalized } from "../../../controllers/dispositif/functions";
import { asyncForEach } from "../../../libs/asyncForEach";
import { getUserById } from "../../../modules/users/users.repository";

interface Query {
  id: ObjectId;
  withDisposAssocies: string;
  localeOfLocalizedDispositifsAssocies: string;
  withMembres: string;
}
interface Membre {
  _id: ObjectId;
  username: string;
  roles: string[];
  picture?: Picture;
}

const adaptDispositifsAssocies = (dispositifs: IDispositif[]) =>
  dispositifs.map((dispositif) => ({
    titreInformatif: dispositif.titreInformatif,
    titreMarque: dispositif.titreMarque,
    _id: dispositif._id,
    tags: dispositif.tags,
    abstract: dispositif.abstract,
    status: dispositif.status,
    suggestions: dispositif.suggestions,
    typeContenu: dispositif.typeContenu,
    created_at: dispositif.created_at,
    nbVues: dispositif.nbVues || 0,
    nbMercis: dispositif.merci ? dispositif.merci.length : 0,
  }));

export const getStructureById = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  if (!req.query || !req.query.id) {
    return res.status(400).json({ text: "Requête invalide" });
  }
  try {
    const {
      id,
      withDisposAssocies,
      localeOfLocalizedDispositifsAssocies,
      withMembres,
    } = req.query;
    const withDisposAssociesBoolean = castToBoolean(withDisposAssocies);
    const withMembresBoolean = castToBoolean(withMembres);

    const withLocalizedDispositifsBoolean = [
      "fr",
      "en",
      "ru",
      "ps",
      "ar",
      "fa",
      "ti-ER",
    ].includes(localeOfLocalizedDispositifsAssocies);

    logger.info("[getStructureById] get structure with id", {
      id,
      withDisposAssociesBoolean,
      withLocalizedDispositifsBoolean,
      localeOfLocalizedDispositifsAssocies,
    });

    const populateDisposAssocies = withLocalizedDispositifsBoolean
      ? true
      : withDisposAssociesBoolean
      ? true
      : false;

    const fields = "all";
    const structure = await getStructureFromDB(
      id,
      populateDisposAssocies,
      fields
    );
    if (!structure) {
      throw new Error("No structure");
    }
    let newStructure = structure;

    if (withLocalizedDispositifsBoolean) {
      const dispositifsAssocies = structure.toJSON().dispositifsAssocies;
      const array: string[] = [];

      array.forEach.call(dispositifsAssocies, (dispositif: any) => {
        turnToLocalized(dispositif, localeOfLocalizedDispositifsAssocies);
      });
      const simplifiedDispositifsAssocies = adaptDispositifsAssocies(
        dispositifsAssocies
      );
      newStructure = {
        ...structure.toJSON(),
        // @ts-ignore populate dispos associes
        dispositifsAssocies: simplifiedDispositifsAssocies,
      };
    }

    if (withMembresBoolean) {
      let membresArray: Membre[] = [];
      await asyncForEach(newStructure.membres, async (membre) => {
        try {
          if (!membre.userId) return;
          const neededFields = { username: 1, picture: 1, last_connected: 1 };
          const populateMembre = await getUserById(membre.userId, neededFields);
          membresArray.push({
            ...populateMembre.toJSON(),
            roles: membre.roles,
          });
        } catch (error) {
          logger.error("[getStructureById] error while getting user", {
            userId: membre.userId,
            error: error.message,
          });
        }
      });

      // @ts-ignore add infos on membres
      newStructure.membres = membresArray;
    } else {
      delete newStructure.membres;
    }

    return res.status(200).json({
      text: "Succès",
      data: newStructure,
    });
  } catch (error) {
    logger.error("[getStructureById] error while getting structure with id", {
      error,
    });
    if (error.message === "No structure") {
      res.status(404).json({
        text: "Pas de résultat",
      });
      return;
    }
    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};
