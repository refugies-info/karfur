import { getAllUsersFromDB } from "../users.repository";
import { Res } from "../../../types/interface";
import { UserDoc } from "../../../schema/schemaUser";
import { ObjectId } from "mongoose";

const getPlateformeRoles = (roles: { _id: ObjectId; nom: string }[]) =>
  roles && roles.length > 0
    ? roles
        .filter((role) => role.nom === "Admin" || role.nom === "Expert Trad")
        .map((role) => role.nom)
    : [];

const getStructureRoles = (
  structure: { membres: null | { userId: ObjectId; roles: string[] }[] } | null,
  userId: ObjectId
) => {
  if (!structure || !structure.membres) return [];

  const isAdmin =
    structure.membres.filter(
      (membres) =>
        membres.userId === userId && membres.roles.includes("administrateur")
    ).length > 0;

  if (isAdmin) return ["responsable"];

  const isContrib = structure.membres.filter(
    (membres) =>
      membres.userId === userId && membres.roles.includes("contributeur")
  );

  if (isContrib) return ["contributeur"];

  return [];
};

const getSelectedLanguages = (langues: { i18nCode: string }[]) => {
  if (!langues || langues.length === 0) return [];

  return langues.map((langue) => langue.i18nCode);
};

const adaptUsers = (users: UserDoc[]) =>
  users.map((user) => {
    const simplifiedStructure =
      user.structures && user.structures.length > 0
        ? {
            // @ts-ignore : structures populate
            _id: user.structures[0]._id,
            // @ts-ignore : structures populate
            nom: user.structures[0].nom,
            // @ts-ignore : structures populate
            picture: user.structures[0].picture,
          }
        : null;

    // @ts-ignore : roles populate
    const plateformeRoles = getPlateformeRoles(user.roles);
    const structureRoles =
      user.structures && user.structures.length > 0
        ? // @ts-ignore : structures populate
          getStructureRoles(user.structures[0], user._id)
        : [];
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
      structure: simplifiedStructure,
      nbStructures: user.structures ? user.structures.length : 0,
    };
  });

export const getAllUsers = async (_: any, res: Res) => {
  try {
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
    console.log("error", error);
    res.status(500).json({ text: "Erreur interne" });
  }
};
