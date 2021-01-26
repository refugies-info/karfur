import { Res } from "../../../types/interface";
import logger from "../../../logger";
import { getAllUsersFromDB } from "../users.repository";
import { adaptUsers } from "../getAllUsers/getAllUsers";
import { ObjectId } from "mongoose";
import moment from "moment";
var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.airtableApiKey }).base(
  process.env.AIRTABLE_BASE_USERS
);

interface User {
  _id: ObjectId;
  username: string;
  created_at: Date;
  roles: string[];
  email: string;
  langues: {
    langueCode: string;
    langueFr: string;
  }[];
  structures: { _id: ObjectId; nom: string }[];
  nbStructures: number;
}
const exportUsersInAirtable = (users: User[]) => {
  const testUsers = users.slice(0, 10);
  testUsers.forEach((user) => {
    const structure =
      user.structures && user.structures.length > 0
        ? user.structures[0].nom
        : "";
    const format2 = "YYYY/MM/DD";
    const createdAt = user.created_at
      ? moment(user.created_at).format(format2)
      : "1900/01/01";
    const rolesWithTraducteur =
      user.langues.length > 0 ? user.roles.concat(["Traducteur"]) : user.roles;
    base("Users").create(
      [
        {
          fields: {
            Pseudonyme: user.username,
            Email: user.email,
            "Date de création": createdAt,
            Role: rolesWithTraducteur,
            "Mots traduits": 10,
            "Temps passé à traduire": 50,
            Structure: structure,
          },
        },
      ],
      function (err: Error) {
        if (err) {
          logger.error("error while adding users to airtable", { error: err });
          return;
        }
      }
    );
  });
};
export const exportUsers = async (_: any, res: Res) => {
  try {
    logger.info("[exportUsers] call received");
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

    await exportUsersInAirtable(adaptedUsers);
    logger.info(
      `[exportUsers] successfully added ${adaptedUsers.length} users`
    );

    return res.status(200).json({
      text: "OK",
    });
  } catch (error) {
    logger.error("[exportUsers] error", { error });
    res.status(500).json({ text: "Erreur interne" });
  }

  return res.status(200).json({ text: "OK" });
};
