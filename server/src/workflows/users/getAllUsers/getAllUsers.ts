import _ from "lodash";
import { getAllUsersFromDB } from "../../../modules/users/users.repository";
import { Langue, Structure, User, UserId } from "src/typegoose";
import { Res } from "src/types/interface";
import logger from "src/logger";

const getRole = (membres: any[], userId: UserId) => {
  const isAdmin =
    membres.filter(
      (membre) =>
        membre.userId && membre.userId.toString() === userId.toString() && membre.roles.includes("administrateur")
    ).length > 0;

  if (isAdmin) return ["Responsable"];

  const isContrib =
    membres.filter(
      (membre) =>
        membre.userId && membre.userId.toString() === userId.toString() && membre.roles.includes("contributeur")
    ).length > 0;

  if (isContrib) return ["Rédacteur"];
  return [];
};

const getStructureRoles = (structures: Structure[], userId: UserId) => {
  if (!structures || structures.length === 0) return [];
  const structure = structures[0];
  if (!structure) return [];

  return getRole(structure.membres, userId);
};

const getSelectedLanguages = (langues: Langue[]) => {
  if (!langues || langues.length === 0) return [];

  const languesFiltered = langues
    .filter((langue) =>
      ["Anglais", "Russe", "Persan", "Pachto", "Arabe", "Tigrinya", "Persan/Dari", "Ukrainien"].includes(
        langue.langueFr
      )
    )
    .map((langue) => ({
      langueCode: langue.langueCode,
      langueFr: langue.langueFr
    }));

  return _.uniq(languesFiltered);
};

export const adaptUsers = (users: User[], role: "admin" | "hasStructure") =>
  users.map((user) => {
    let simpleUser = {
      _id: user._id,
      username: user.username,
      picture: user.picture,
      status: user.status,
      email: user.email,
      adminComments: user.adminComments
    };
    // hasStructure
    if (role === "hasStructure") return simpleUser;

    // admin
    const simplifiedStructures = user.getStructures().map((structure) => {
      const role = getRole(structure.membres, user._id);
      return {
        _id: structure._id,
        nom: structure.nom,
        picture: structure.picture,
        role
      };
    });

    const plateformeRoles = user.getPlateformeRoles();
    const structureRoles = getStructureRoles(user.getStructures(), user._id);

    const roles = plateformeRoles.concat(structureRoles);

    const langues = getSelectedLanguages(user.getSelectedLanguages());
    return {
      ...simpleUser,
      created_at: user.created_at,
      last_connected: user.last_connected,
      roles,
      phone: user.phone,
      langues,
      structures: simplifiedStructures,
      nbStructures: user.structures ? user.structures.length : 0,
      nbContributions: user.contributions ? user.contributions.length : 0
    };
  });

export const getAllUsers = async (req: any, res: Res) => {
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
      phone: 1,
      selectedLanguages: 1,
      adminComments: 1
    };

    const users = await getAllUsersFromDB(neededFields);

    // Check authorizations
    const currentUser = users.find((u) => u._id.toString() === req.user._id.toString());
    const isAdmin = currentUser && currentUser.hasRole("Admin");
    const hasStructure = currentUser && currentUser.structures && currentUser.structures?.length > 0;
    if (!isAdmin && !hasStructure) throw new Error("NOT_AUTHORIZED");

    const adaptedUsers = adaptUsers(users, isAdmin ? "admin" : "hasStructure");

    return res.status(200).json({
      data: adaptedUsers
    });
  } catch (error) {
    logger.error("[getAllUsers] error", { error: error.message });
    switch (error.message) {
      case "NOT_AUTHORIZED":
        return res.status(403).json({ text: "Accès interdit" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
