import { Res, RequestFromClient } from "../../../types/interface";
import logger from "../../../logger";
import { getAllUsersFromDB } from "../users.repository";
import { adaptUsers } from "../getAllUsers/getAllUsers";
import { ObjectId } from "mongoose";
import moment from "moment";
import { asyncForEach } from "../../../libs/asyncForEach";
import { computeGlobalIndicator } from "../../../controllers/traduction/lib";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
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
  nbContributions: number;
  totalIndicator: { wordsCount: number; timeSpent: number }[];
}
const exportUsersInAirtable = (users: User[]) => {
  users.forEach((user) => {
    const structure =
      user.structures && user.structures.length > 0
        ? user.structures.map((structure) => structure.nom).join()
        : "";
    const format2 = "YYYY/MM/DD";
    const createdAt = user.created_at
      ? moment(user.created_at).format(format2)
      : "1900/01/01";
    const rolesWithTraducteur =
      user.langues.length > 0 ? user.roles.concat(["Traducteur"]) : user.roles;

    const langues = user.langues.map((langue) => langue.langueFr);
    const nbWords =
      user.totalIndicator && user.totalIndicator.length > 0
        ? Math.floor(user.totalIndicator[0].wordsCount)
        : 0;

    const timeSpent =
      user.totalIndicator && user.totalIndicator.length > 0
        ? Math.floor(user.totalIndicator[0].timeSpent / 60 / 1000)
        : 0;

    base("Users").create(
      [
        {
          fields: {
            Pseudonyme: user.username,
            Email: user.email,
            "Date de création": createdAt,
            Role: rolesWithTraducteur,
            "Mots traduits": nbWords,
            "Temps passé à traduire": timeSpent,
            Structure: structure,
            Langues: langues,
            "Nb fiches avec contribution": user.nbContributions,
            Env: process.env.NODE_ENV,
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
export const exportUsers = async (req: RequestFromClient<{}>, res: Res) => {
  try {
    // @ts-ignore : populate roles
    checkIfUserIsAdmin(req.user.roles);

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
      contributions: 1,
    };

    const users = await getAllUsersFromDB(neededFields);
    const adaptedUsers = adaptUsers(users);

    const usersWithIndicators: User[] = [];

    await asyncForEach(adaptedUsers, async (user) => {
      logger.info(`[exportUsers] get indicators user ${user._id}`);

      const totalIndicator = await computeGlobalIndicator(user._id);

      usersWithIndicators.push({ ...user, totalIndicator });
    });

    await exportUsersInAirtable(usersWithIndicators);
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
};
