/* NOT USED
import { Dispositif } from "../../schema/schemaDispositif";
import { Structure } from "../../schema/schemaStructure";

import logger from "../../logger";
import { Res } from "../../types/interface";
import { asyncForEach } from "../../libs/asyncForEach";

const correctStructure = async (
  dispositifId: string,
  structureIdOfDispo: string,
  wrongStructureId: string
) => {
  // we need to
  // remove dispositifId in dispositifAssocies of wrongStructureId
  // add dispositifId in dispositifAssocies of structureIdOfDispo

  await Structure.findByIdAndUpdate(
    { _id: wrongStructureId },
    {
      $removeToSet: {
        dispositifsAssocies: dispositifId,
      },
    },
    { upsert: true, new: true },
    () => {}
  );
};

interface Error {
  dispositifId: string;
  sponsorIdOfDispo: string;
  structureId: string;
  motif: string;
}
export const targetErrosOnDispositifsAssociesInStructures = async (
  req: {},
  res: Res
) => {
  try {
    const errors: Error[] = [];
    logger.info("[targetErrosOnDispositifsAssociesInStructures] received ");
    const dispositifArray = await Dispositif.find();

    await asyncForEach(dispositifArray, async (dispositif: any) => {
      // for every dispositif we check if a structure has the dispositif associe
      const structureArray = await Structure.find({
        dispositifsAssocies: dispositif._id,
      });

      if (structureArray.length === 0) {
        if (
          dispositif &&
          dispositif.sponsors &&
          dispositif.sponsors[0] &&
          dispositif.sponsors[0]._id
        ) {
          // error case 1 : dispositif has a sponsor but no structure has the dipso
          errors.push({
            dispositifId: dispositif._id,
            sponsorIdOfDispo: "",
            structureId: "",
            motif: "case1",
          });
        }
        return;
      }

      const sponsorIdOfDispo =
        dispositif.sponsors &&
        dispositif.sponsors[0] &&
        dispositif.sponsors[0]._id
          ? dispositif.sponsors[0]._id
          : null;
      structureArray.map((structure: any) => {
        if (structure) {
          if (!sponsorIdOfDispo) {
            // error case 2 : a structure has the dispo associe but the dispo has no structure
            errors.push({
              dispositifId: dispositif._id,
              sponsorIdOfDispo: "",
              structureId: structure._id,
              motif: "case2",
            });
            return;
          }
          if (sponsorIdOfDispo.toString() === structure._id.toString()) {
            // good case
            return;
          }

          // error case 3 : a structure has the dispo associe but it is not the good structure
          errors.push({
            dispositifId: dispositif._id,
            sponsorIdOfDispo,
            structureId: structure._id,
            motif: "case3",
          });
        }
      });
    });

    res.status(200).json({ nbErrors: errors.length, errors });
  } catch (error) {
    logger.error("[targetErrosOnDispositifsAssociesInStructures] error", {
      error,
    });
    res.status(404).json({ error });
  }
};

interface Query {
  token: string;
}

interface Result {
  _id: ObjectId;
  nom: string;
  responsable: { username: string; email?: string; _id: ObjectId };
  contact: string;
  mail_contact: string;
  phone_contact: string;
}
export const getResponsableOfStructure = async (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    if (!req.query || !req.query.token) {
      return res.status(400).json({ text: "Requête invalide" });
    }
    const splittedEnv = process.env.REACT_APP_SITE_SECRET.split("&");
    if (req.query.token !== splittedEnv[0]) {
      return res.status(400).json({ text: "Requête invalide" });
    }
    const neededFields = {
      nom: 1,
      membres: 1,
      contact: 1,
      mail_contact: 1,
      phone_contact: 1,
    };
    const structures = await Structure.find({ status: "Actif" }, neededFields);
    const result: Result[] = [];
    await asyncForEach(structures, async (structure) => {
      const responsables = structure.membres.filter((membre) =>
        membre.roles.includes("administrateur")
      );
      await asyncForEach(responsables, async (responsable) => {
        if (responsable.userId) {
          const user = await User.findOne(
            { _id: responsable.userId },
            { username: 1, email: 1 }
          );

          if (user && user.email) {
            result.push({
              _id: structure._id,
              nom: structure.nom,
              contact: structure.contact,
              mail_contact: structure.mail_contact,
              phone_contact: structure.phone_contact,
              responsable: user,
            });
          }
        }
      });
    });

    return res.status(200).json({ text: `OK ${result.length}`, data: result });
  } catch (error) {
    logger.error("[getResponsableOfStructure] error", { error });
  }
};
*/
