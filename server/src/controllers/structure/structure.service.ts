import logger = require("../../logger");
import { RequestFromClient, Res, IDispositif } from "../../types/interface.js";
import {
  getStructureFromDB,
  getStructuresFromDB,
} from "./structure.repository";
import { castToBoolean } from "../../libs/castToBoolean";
import { turnToLocalized } from "../dispositif/functions";
import { ObjectId } from "mongoose";
import { asyncForEach } from "../../libs/asyncForEach";
import { getUserById } from "../account/users.repository";

interface Query {
  id: ObjectId;
  withDisposAssocies: string;
  localeOfLocalizedDispositifsAssocies: string;
}

const adaptDispositifsAssocies = (dispositifs: IDispositif[]) =>
  dispositifs.map((dispositif) => ({
    titreInformatif: dispositif.titreInformatif,
    titreMarque: dispositif.titreMarque,
    _id: dispositif._id,
    tags: dispositif.tags,
    abstract: dispositif.abstract,
    status: dispositif.status,
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
    } = req.query;
    const withDisposAssociesBoolean = castToBoolean(withDisposAssocies);

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

    if (withLocalizedDispositifsBoolean) {
      const dispositifsAssocies = structure.toJSON().dispositifsAssocies;
      const array: string[] = [];

      array.forEach.call(dispositifsAssocies, (dispositif: any) => {
        turnToLocalized(dispositif, localeOfLocalizedDispositifsAssocies);
      });
      const simplifiedDispositifsAssocies = adaptDispositifsAssocies(
        dispositifsAssocies
      );
      const newStructure = {
        ...structure.toJSON(),
        dispositifsAssocies: simplifiedDispositifsAssocies,
      };
      return res.status(200).json({
        text: "Succès",
        data: newStructure,
      });
    }

    return res.status(200).json({
      text: "Succès",
      data: structure,
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

export const getActiveStructures = async (req: {}, res: Res) => {
  try {
    logger.info("[getActiveStructures] get structures ");
    const structures = await getStructuresFromDB(
      { status: "Actif" },
      { nom: 1, acronyme: 1, picture: 1 },
      false
    );
    return res.status(200).json({ data: structures });
  } catch (error) {
    logger.error("[getActiveStructures] error while getting structures", {
      error,
    });

    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};

export const getAllStructures = async (req: {}, res: Res) => {
  try {
    logger.info("[getAllStructures] get structures ");
    const neededFields = {
      nom: 1,
      status: 1,
      picture: 1,
      dispositifsAssocies: 1,
      contact: 1,
      phone_contact: 1,
      mail_contact: 1,
      membres: 1,
      created_at: 1,
    };
    const structures = await getStructuresFromDB({}, neededFields, true);
    const simplifiedStructures = structures.map((structure) => {
      const jsonStructure = structure.toJSON();
      const nbMembres = jsonStructure.membres
        ? jsonStructure.membres.length
        : 0;
      const responsablesArray = jsonStructure.membres
        ? jsonStructure.membres.filter(
            (user) => user.roles && user.roles.includes("administrateur")
          )
        : [];
      const responsableId =
        responsablesArray.length > 0 ? responsablesArray[0].userId : null;

      const dispositifsAssocies = jsonStructure.dispositifsAssocies.filter(
        (dispo) =>
          //@ts-ignore
          dispo.status &&
          // @ts-ignore
          !["Supprimé", "Brouillon"].includes(dispo.status)
      );
      const array: string[] = [];

      array.forEach.call(dispositifsAssocies, (dispositif: any) => {
        turnToLocalized(dispositif, "fr");
      });

      const simplifiedDisposAssocies = adaptDispositifsAssocies(
        dispositifsAssocies
      );

      delete jsonStructure.membres;
      return {
        ...jsonStructure,
        dispositifsAssocies: simplifiedDisposAssocies,
        nbMembres,
        responsable: responsableId,
      };
    });

    // @ts-ignore
    const data = [];
    await asyncForEach(
      simplifiedStructures,
      async (structure): Promise<any> => {
        if (structure.responsable) {
          const responsable = await getUserById(structure.responsable);
          return data.push({ ...structure, responsable });
        }
        return data.push({ ...structure, responsable: null });
      }
    );

    // @ts-ignore
    return res.status(200).json({ data });
  } catch (error) {
    logger.error("[getAllStructures] error while getting structures", {
      error,
    });

    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};
