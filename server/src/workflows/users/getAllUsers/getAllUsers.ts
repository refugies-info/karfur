import { getAllUsersFromDB } from "../../../modules/users/users.repository";
import { Res, Picture } from "../../../types/interface";
import { UserDoc } from "../../../schema/schemaUser";
import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { LangueDoc } from "../../../schema/schemaLangue";
import _ from "lodash";

interface Indicator {
  _id: ObjectId;
  wordsCount: number;
  timeSpent: number;
}
interface ReturnedUser {
  username: string;
  picture: Picture;
  status: string;
  _id: ObjectId;
  created_at: Date;
  roles: string[];
  email: string;
  langues: { langueCode: string; langueFr: string }[];
  structures: { _id: ObjectId; nom: string; picture: Picture }[];
  nbStructures: number;
  threeMonthsIndicator?: Indicator;
  sixMonthsIndicator?: Indicator;
  twelveMonthsIndicator?: Indicator;
  totalIndicator?: Indicator;
}

const getPlateformeRoles = (roles: { _id: ObjectId; nom: string }[]) =>
  roles && roles.length > 0
    ? roles
        .filter((role) => role.nom === "Admin" || role.nom === "ExpertTrad")
        .map((role) => role.nom)
    : [];

const getRole = (membres: any[], userId: ObjectId) => {
  const isAdmin =
    membres.filter(
      (membre) =>
        membre.userId &&
        membre.userId.toString() === userId.toString() &&
        membre.roles.includes("administrateur")
    ).length > 0;

  if (isAdmin) return ["Responsable"];

  const isContrib =
    membres.filter(
      (membre) =>
        membre.userId &&
        membre.userId.toString() === userId.toString() &&
        membre.roles.includes("contributeur")
    ).length > 0;

  if (isContrib) return ["Rédacteur"];
  return [];
};
const getStructureRoles = (
  structures: { membres: null | { userId: ObjectId; roles: string[] }[] }[],
  userId: ObjectId
) => {
  if (!structures || structures.length === 0) return [];
  const structure = structures[0];
  if (!structure) return [];

  return getRole(structure.membres, userId);
};

const getSelectedLanguages = (langues: LangueDoc[]) => {
  if (!langues || langues.length === 0) return [];

  const languesFiltered = langues
    .filter((langue) =>
      [
        "Anglais",
        "Russe",
        "Persan",
        "Pachto",
        "Arabe",
        "Tigrinya",
        "Persan/Dari",
      ].includes(langue.langueFr)
    )
    .map((langue) => ({
      langueCode: langue.langueCode,
      langueFr: langue.langueFr,
    }));

  return _.uniq(languesFiltered);
};

export const adaptUsers = (users: UserDoc[]) =>
  users.map((user) => {
    const simplifiedStructures =
      user.structures && user.structures.length > 0
        ? user.structures.map((structure) => {
            // @ts-ignore : structures populate
            const role = getRole(structure.membres, user._id);
            return {
              // @ts-ignore : structures populate
              _id: structure._id,
              // @ts-ignore : structures populate
              nom: structure.nom,
              // @ts-ignore : structures populate
              picture: structure.picture,
              role,
            };
          })
        : [];

    // @ts-ignore : roles populate
    const plateformeRoles = getPlateformeRoles(user.roles);

    // @ts-ignore : structures populate
    const structureRoles = getStructureRoles(user.structures, user._id);

    const roles = plateformeRoles.concat(structureRoles);

    const langues = getSelectedLanguages(user.selectedLanguages);
    return {
      _id: user._id,
      username: user.username,
      picture: user.picture,
      status: user.status,
      created_at: user.created_at,
      roles,
      email: user.email,
      langues,
      structures: simplifiedStructures,
      nbStructures: user.structures ? user.structures.length : 0,
      nbContributions: user.contributions ? user.contributions.length : 0,
    };
  });

export const getAllUsers = async (_: any, res: Res) => {
  try {
    logger.info("[getAllUsers] call received");
    const neededFields = {
      username: 1,
      picture: 1,
      status: 1,
      created_at: 1,
      roles: 1,
      structures: 1,
      email: 1,
      selectedLanguages: 1,
    };

    const users = await getAllUsersFromDB(neededFields);
    const adaptedUsers = adaptUsers(users);

    return res.status(200).json({
      data: adaptedUsers,
    });
  } catch (error) {
    logger.error("[getAllUsers] error", { error: error.message });
    res.status(500).json({ text: "Erreur interne" });
  }
};
